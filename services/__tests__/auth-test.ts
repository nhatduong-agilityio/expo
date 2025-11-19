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
    from: jest.fn().mockReturnThis(),
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

    it('should throw an error if sign up fails', async () => {
      const mockError = new Error('Sign up failed');
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(
        authService.signUp({
          email: 'test@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(mockError);
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

    it('should throw an error if sign in fails', async () => {
      const mockError = new Error('Sign in failed');
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(
        authService.signIn({
          email: 'test@test.com',
          password: 'password',
          rememberMe: true,
        }),
      ).rejects.toThrow(mockError);
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

    it('should handle sign in without session data', async () => {
      const mockResponse = {
        data: {
          user: { id: 'user-id' },
          session: null,
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

      expect(result).toEqual(mockResponse.data);
      expect(secureStorage.setSessionData).not.toHaveBeenCalled();
    });

    it('should handle sign in with session but without access token', async () => {
      const mockResponse = {
        data: {
          user: { id: 'user-id' },
          session: {
            access_token: null,
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

      expect(secureStorage.setSessionData).toHaveBeenCalled();
      expect(secureStorage.setAccessToken).not.toHaveBeenCalled();
      expect(secureStorage.setRefreshToken).toHaveBeenCalledWith(
        'refresh-token',
      );
    });

    it('should handle sign in with session but without refresh token', async () => {
      const mockResponse = {
        data: {
          user: { id: 'user-id' },
          session: {
            access_token: 'access-token',
            refresh_token: null,
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

      expect(secureStorage.setSessionData).toHaveBeenCalled();
      expect(secureStorage.setAccessToken).toHaveBeenCalledWith('access-token');
      expect(secureStorage.setRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should sign out a user successfully', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(secureStorage.clear).toHaveBeenCalled();
    });

    it('should throw an error if sign out fails', async () => {
      const mockError = new Error('Sign out failed');
      (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: mockError,
      });

      await expect(authService.signOut()).rejects.toThrow(mockError);
    });
  });

  describe('getSession', () => {
    it('should return a session from secure storage if it is valid', async () => {
      const mockSession = {
        expires_at: Date.now() / 1000 + 3600,
        user: { id: 'user-id' },
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockSession),
      );

      const session = await authService.getSession();

      expect(session).toEqual(mockSession);
    });

    it('should refresh the session if it is expired', async () => {
      const expiredSession = {
        expires_at: Date.now() / 1000 - 3600,
        user: { id: 'user-id' },
      };
      const newSession = {
        expires_at: Date.now() / 1000 + 3600,
        user: { id: 'new-user-id' },
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(expiredSession),
      );
      (secureStorage.getRefreshToken as jest.Mock).mockResolvedValueOnce(
        'refresh-token',
      );
      (supabase.auth.refreshSession as jest.Mock).mockResolvedValueOnce({
        data: { session: newSession },
        error: null,
      });

      const session = await authService.getSession();

      expect(session).toEqual(newSession);
      expect(secureStorage.setSessionData).toHaveBeenCalledWith(
        JSON.stringify(newSession),
      );
      expect(secureStorage.setAccessToken).toHaveBeenCalledWith(
        'new-access-token',
      );
      expect(secureStorage.setRefreshToken).toHaveBeenCalledWith(
        'new-refresh-token',
      );
    });

    it('should fallback to supabase if refresh fails', async () => {
      const expiredSession = {
        expires_at: Date.now() / 1000 - 3600,
        user: { id: 'user-id' },
      };
      const mockSession = {
        user: { id: 'supabase-user-id' },
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(expiredSession),
      );
      (secureStorage.getRefreshToken as jest.Mock).mockResolvedValueOnce(
        'refresh-token',
      );
      (supabase.auth.refreshSession as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: new Error('Refresh failed'),
      });
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const session = await authService.getSession();

      expect(session).toEqual(mockSession);
      expect(secureStorage.setSessionData).toHaveBeenCalledWith(
        JSON.stringify(mockSession),
      );
    });

    it('should fallback to supabase if no session data in storage', async () => {
      const mockSession = {
        user: { id: 'supabase-user-id' },
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(null);
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const session = await authService.getSession();

      expect(session).toEqual(mockSession);
    });

    it('should return null if supabase throws error', async () => {
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(null);
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: new Error('Supabase error'),
      });

      const session = await authService.getSession();

      expect(session).toBeNull();
    });

    it('should return null if an exception occurs', async () => {
      (secureStorage.getSessionData as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error'),
      );

      const session = await authService.getSession();

      expect(session).toBeNull();
    });

    it('should handle session without access token when storing', async () => {
      const mockSession = {
        user: { id: 'supabase-user-id' },
        access_token: null,
        refresh_token: 'refresh-token',
      };
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(null);
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      await authService.getSession();

      expect(secureStorage.setSessionData).toHaveBeenCalled();
      expect(secureStorage.setAccessToken).not.toHaveBeenCalled();
      expect(secureStorage.setRefreshToken).toHaveBeenCalledWith(
        'refresh-token',
      );
    });

    it('should handle session without refresh token when storing', async () => {
      const mockSession = {
        user: { id: 'supabase-user-id' },
        access_token: 'access-token',
        refresh_token: null,
      };
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(null);
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      await authService.getSession();

      expect(secureStorage.setSessionData).toHaveBeenCalled();
      expect(secureStorage.setAccessToken).toHaveBeenCalledWith('access-token');
      expect(secureStorage.setRefreshToken).not.toHaveBeenCalled();
    });

    it('should fallback to supabase if no refresh token available', async () => {
      const expiredSession = {
        expires_at: Date.now() / 1000 - 3600,
        user: { id: 'user-id' },
      };
      const mockSession = {
        user: { id: 'supabase-user-id' },
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };
      (secureStorage.getSessionData as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(expiredSession),
      );
      (secureStorage.getRefreshToken as jest.Mock).mockResolvedValueOnce(null);
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const session = await authService.getSession();

      expect(session).toEqual(mockSession);
    });
  });

  describe('refreshSession', () => {
    it('should refresh session successfully', async () => {
      const newSession = {
        expires_at: Date.now() / 1000 + 3600,
        user: { id: 'user-id' },
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };
      (secureStorage.getRefreshToken as jest.Mock).mockResolvedValueOnce(
        'refresh-token',
      );
      (supabase.auth.refreshSession as jest.Mock).mockResolvedValueOnce({
        data: { session: newSession },
        error: null,
      });

      const session = await authService.refreshSession();

      expect(session).toEqual(newSession);
      expect(secureStorage.setSessionData).toHaveBeenCalledWith(
        JSON.stringify(newSession),
      );
      expect(secureStorage.setAccessToken).toHaveBeenCalledWith(
        'new-access-token',
      );
      expect(secureStorage.setRefreshToken).toHaveBeenCalledWith(
        'new-refresh-token',
      );
    });

    it('should throw an error if no refresh token is available', async () => {
      (secureStorage.getRefreshToken as jest.Mock).mockResolvedValueOnce(null);

      await expect(authService.refreshSession()).rejects.toThrow(
        'No refresh token available',
      );
    });

    it('should throw an error if refresh session fails', async () => {
      const mockError = new Error('Refresh session failed');
      (secureStorage.getRefreshToken as jest.Mock).mockResolvedValueOnce(
        'refresh-token',
      );
      (supabase.auth.refreshSession as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(authService.refreshSession()).rejects.toThrow(mockError);
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const mockProfile = { id: 'user-id', username: 'testuser' };
      const single = jest.fn().mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      });
      const eq = jest.fn().mockReturnValue({ single });
      const select = jest.fn().mockReturnValue({ eq });
      (supabase.from as jest.Mock).mockReturnValue({ select });

      const result = await authService.getProfile('user-id');

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should throw an error if get profile fails', async () => {
      const mockError = new Error('Get profile failed');
      const single = jest.fn().mockResolvedValueOnce({
        data: null,
        error: mockError,
      });
      const eq = jest.fn().mockReturnValue({ single });
      const select = jest.fn().mockReturnValue({ eq });
      (supabase.from as jest.Mock).mockReturnValue({ select });

      await expect(authService.getProfile('user-id')).rejects.toThrow(
        mockError,
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updates = { username: 'updated' };
      const mockProfile = { id: 'user-id', username: 'updated' };
      const single = jest.fn().mockResolvedValueOnce({
        data: mockProfile,
        error: null,
      });
      const select = jest.fn().mockReturnValue({ single });
      const eq = jest.fn().mockReturnValue({ select });
      const update = jest.fn().mockReturnValue({ eq });
      (supabase.from as jest.Mock).mockReturnValue({ update });

      const result = await authService.updateProfile(
        'user-id',
        updates as never,
      );

      expect(result).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should throw an error if update profile fails', async () => {
      const mockError = new Error('Update profile failed');
      const updates = { username: 'updated' };
      const single = jest.fn().mockResolvedValueOnce({
        data: null,
        error: mockError,
      });
      const select = jest.fn().mockReturnValue({ single });
      const eq = jest.fn().mockReturnValue({ select });
      const update = jest.fn().mockReturnValue({ eq });
      (supabase.from as jest.Mock).mockReturnValue({ update });

      await expect(
        authService.updateProfile('user-id', updates as never),
      ).rejects.toThrow(mockError);
    });
  });

  describe('searchAuthors', () => {
    it('should search authors with query successfully', async () => {
      const mockAuthors = [
        { id: '1', username: 'user1' },
        { id: '2', username: 'user2' },
      ];
      const range = jest.fn().mockResolvedValueOnce({
        data: mockAuthors,
        error: null,
        count: 2,
      });
      const or = jest.fn().mockReturnValue({ range });
      const order = jest.fn().mockReturnValue({ or });
      const select = jest.fn().mockReturnValue({ order });
      (supabase.from as jest.Mock).mockReturnValue({ select });

      const result = await authService.searchAuthors('query');

      expect(result.data).toBeDefined();
      expect(result.count).toBe(2);
      expect(result.totalPages).toBe(1);
    });

    it('should search authors without query successfully', async () => {
      const mockAuthors = [
        { id: '1', username: 'user1' },
        { id: '2', username: 'user2' },
      ];
      const range = jest.fn().mockResolvedValueOnce({
        data: mockAuthors,
        error: null,
        count: 2,
      });
      const order = jest.fn().mockReturnValue({ range });
      const select = jest.fn().mockReturnValue({ order });
      (supabase.from as jest.Mock).mockReturnValue({ select });

      const result = await authService.searchAuthors('');

      expect(result.data).toBeDefined();
      expect(result.count).toBe(2);
    });

    it('should throw an error if search authors fails', async () => {
      const mockError = new Error('Search authors failed');
      const range = jest.fn().mockResolvedValueOnce({
        data: null,
        error: mockError,
        count: null,
      });
      const or = jest.fn().mockReturnValue({ range });
      const order = jest.fn().mockReturnValue({ or });
      const select = jest.fn().mockReturnValue({ order });
      (supabase.from as jest.Mock).mockReturnValue({ select });

      await expect(authService.searchAuthors('query')).rejects.toThrow(
        mockError,
      );
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
