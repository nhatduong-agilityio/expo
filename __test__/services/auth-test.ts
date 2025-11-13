import { authService } from '@/services/auth';
import { supabase } from '@/services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a user', async () => {
      const mockResponse = { data: { user: { id: 'user-id' } }, error: null };
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.signUp({
        email: 'test@test.com',
        password: 'password',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('signIn', () => {
    it('should sign in a user and set remember me', async () => {
      const mockResponse = { data: { user: { id: 'user-id' } }, error: null };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await authService.signIn({
        email: 'test@test.com',
        password: 'password',
        rememberMe: true,
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@news_app_remember_me',
        'true',
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@news_app_remembered_email',
        'test@test.com',
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should sign in a user and not set remember me', async () => {
      const mockResponse = { data: { user: { id: 'user-id' } }, error: null };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      await authService.signIn({
        email: 'test@test.com',
        password: 'password',
        rememberMe: false,
      });

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@news_app_remember_me',
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@news_app_remembered_email',
      );
    });
  });

  describe('signOut', () => {
    it('should sign out a user and clear remember me', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@news_app_remember_me',
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@news_app_remembered_email',
      );
    });
  });

  describe('getSession', () => {
    it('should get the current session', async () => {
      const mockSession = { session: { user: { id: 'user-id' } } };
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: mockSession,
        error: null,
      });

      const result = await authService.getSession();

      expect(result).toEqual(mockSession.session);
    });
  });

  describe('getProfile', () => {
    it('should get a user profile', async () => {
      const mockProfile = { id: 'user-id', username: 'test' };
      (supabase.from('profiles').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValueOnce({ data: mockProfile, error: null }),
      });

      const result = await authService.getProfile('user-id');

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update a user profile', async () => {
      const mockProfile = { id: 'user-id', username: 'updated' };
      const updates = { username: 'updated' };
      (supabase.from('profiles').update as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValueOnce({ data: mockProfile, error: null }),
      });

      const result = await authService.updateProfile(
        'user-id',
        updates as never,
      );

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getRememberedEmail', () => {
    it('should return the remembered email if remember me is enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation(key => {
        if (key === '@news_app_remember_me') return 'true';
        if (key === '@news_app_remembered_email') return 'test@test.com';
        return null;
      });

      const email = await authService.getRememberedEmail();
      expect(email).toBe('test@test.com');
    });

    it('should return null if remember me is not enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('false');
      const email = await authService.getRememberedEmail();
      expect(email).toBeNull();
    });
  });

  describe('isRememberMeEnabled', () => {
    it('should return true if remember me is enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('true');
      const isEnabled = await authService.isRememberMeEnabled();
      expect(isEnabled).toBe(true);
    });

    it('should return false if remember me is not enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('false');
      const isEnabled = await authService.isRememberMeEnabled();
      expect(isEnabled).toBe(false);
    });
  });
});
