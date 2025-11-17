import { authService, secureStorage, supabase } from '@/services';

jest.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      refreshSession: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    })),
  },
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
      const mockResponse = {
        data: {
          user: { id: 'user-id' },
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
          },
        },
        error: null,
      };
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
      expect(secureStorage.setRememberMeEnabled).toHaveBeenCalledWith(true);
      expect(secureStorage.setRememberMeEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should sign in a user and not set remember me', async () => {
      const mockResponse = {
        data: {
          user: { id: 'user-id' },
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
          },
        },
        error: null,
      };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce(
        mockResponse,
      );

      await authService.signIn({
        email: 'test@test.com',
        password: 'password',
        rememberMe: false,
      });

      expect(secureStorage.removeRememberMeEnabled).toHaveBeenCalled();
      expect(secureStorage.removeRememberMeEmail).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should sign out a user and clear secure storage', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(secureStorage.clear).toHaveBeenCalled();
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
      const single = jest
        .fn()
        .mockResolvedValueOnce({ data: mockProfile, error: null });
      const eq = jest.fn().mockReturnValue({ single });
      const select = jest.fn().mockReturnValue({ eq });
      (supabase.from as jest.Mock).mockReturnValue({ select });

      const result = await authService.getProfile('user-id');

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update a user profile', async () => {
      const mockProfile = { id: 'user-id', username: 'updated' };
      const updates = { username: 'updated' };
      const single = jest
        .fn()
        .mockResolvedValueOnce({ data: mockProfile, error: null });
      const select = jest.fn().mockReturnValue({ single });
      const eq = jest.fn().mockReturnValue({ select });
      const update = jest.fn().mockReturnValue({ eq });
      (supabase.from as jest.Mock).mockReturnValue({ update });

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
      (secureStorage.getRememberMeEnabled as jest.Mock).mockResolvedValueOnce(
        true,
      );
      (secureStorage.getRememberMeEmail as jest.Mock).mockResolvedValueOnce(
        'test@test.com',
      );

      const email = await authService.getRememberedEmail();
      expect(email).toBe('test@test.com');
    });

    it('should return null if remember me is not enabled', async () => {
      (secureStorage.getRememberMeEnabled as jest.Mock).mockResolvedValueOnce(
        false,
      );
      const email = await authService.getRememberedEmail();
      expect(email).toBeNull();
    });
  });

  describe('isRememberMeEnabled', () => {
    it('should return true if remember me is enabled', async () => {
      (secureStorage.getRememberMeEnabled as jest.Mock).mockResolvedValueOnce(
        true,
      );
      const isEnabled = await authService.isRememberMeEnabled();
      expect(isEnabled).toBe(true);
    });

    it('should return false if remember me is not enabled', async () => {
      (secureStorage.getRememberMeEnabled as jest.Mock).mockResolvedValueOnce(
        false,
      );
      const isEnabled = await authService.isRememberMeEnabled();
      expect(isEnabled).toBe(false);
    });
  });
});
