import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  SESSION_DATA: 'auth_session_data',
  REMEMBER_ME_EMAIL: 'auth_remember_email',
  REMEMBER_ME_ENABLED: 'auth_remember_enabled',
} as const;

// Check if SecureStore is available
const isSecureStoreAvailable = () => {
  try {
    return Platform.OS !== 'web' && SecureStore.isAvailableAsync !== undefined;
  } catch {
    return false;
  }
};

/**
 * Secure storage service using Expo SecureStore
 * Falls back to AsyncStorage if SecureStore is not available
 */
export const secureStorage = {
  /**
   * Store a value securely
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' || !isSecureStoreAvailable()) {
        // Web or SecureStore not available - use AsyncStorage
        console.warn(
          'SecureStore not available. Using AsyncStorage (not secure).',
        );
        await AsyncStorage.setItem(key, value);
        return;
      }

      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('SecureStore setItem error:', error);
      // Fallback to AsyncStorage
      try {
        await AsyncStorage.setItem(key, value);
      } catch (fallbackError) {
        console.error('AsyncStorage fallback error:', fallbackError);
        throw new Error('Failed to store secure data');
      }
    }
  },

  /**
   * Retrieve a value securely
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' || !isSecureStoreAvailable()) {
        return await AsyncStorage.getItem(key);
      }

      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      // Fallback to AsyncStorage
      try {
        return await AsyncStorage.getItem(key);
      } catch (fallbackError) {
        console.error('AsyncStorage fallback error:', fallbackError);
        return null;
      }
    }
  },

  /**
   * Remove a value securely
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' || !isSecureStoreAvailable()) {
        await AsyncStorage.removeItem(key);
        return;
      }

      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
      // Fallback to AsyncStorage
      try {
        await AsyncStorage.removeItem(key);
      } catch (fallbackError) {
        console.error('AsyncStorage fallback error:', fallbackError);
        throw new Error('Failed to remove secure data');
      }
    }
  },

  /**
   * Clear all secure storage
   */
  async clear(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await Promise.all(keys.map(key => this.removeItem(key)));
    } catch (error) {
      console.error('SecureStore clear error:', error);
      throw new Error('Failed to clear secure storage');
    }
  },

  // Specific methods for auth data
  async setAccessToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getAccessToken(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async removeAccessToken(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async removeRefreshToken(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setSessionData(data: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.SESSION_DATA, data);
  },

  async getSessionData(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.SESSION_DATA);
  },

  async removeSessionData(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.SESSION_DATA);
  },

  async setRememberMeEmail(email: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.REMEMBER_ME_EMAIL, email);
  },

  async getRememberMeEmail(): Promise<string | null> {
    return await this.getItem(STORAGE_KEYS.REMEMBER_ME_EMAIL);
  },

  async removeRememberMeEmail(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.REMEMBER_ME_EMAIL);
  },

  async setRememberMeEnabled(enabled: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.REMEMBER_ME_ENABLED, String(enabled));
  },

  async getRememberMeEnabled(): Promise<boolean> {
    const value = await this.getItem(STORAGE_KEYS.REMEMBER_ME_ENABLED);
    return value === 'true';
  },

  async removeRememberMeEnabled(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.REMEMBER_ME_ENABLED);
  },
};
