// Load test environment variables
if (process.env.NODE_ENV === 'test') {
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
}

// Mock expo-router
jest.mock('expo-router', () => {
  const actualRouter = jest.requireActual('expo-router');
  return {
    ...actualRouter,
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
    })),
    useLocalSearchParams: jest.fn(() => ({})),
    useSegments: jest.fn(() => []),
    usePathname: jest.fn(() => '/'),
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      canGoBack: jest.fn(() => true),
    },
  };
});

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'test-image-uri' }],
    }),
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' }),
  ),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@/services/secureStorage', () => ({
  secureStorage: {
    setSessionData: jest.fn(),
    setAccessToken: jest.fn(),
    setRefreshToken: jest.fn(),
    setRememberMeEnabled: jest.fn(),
    setRememberMeEmail: jest.fn(),
    removeRememberMeEnabled: jest.fn(),
    removeRememberMeEmail: jest.fn(),
    clear: jest.fn(),
    getSessionData: jest.fn(),
    getRefreshToken: jest.fn(),
    getRememberMeEnabled: jest.fn(),
    getRememberMeEmail: jest.fn(),
  },
}));

jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

jest.mock('base64-arraybuffer', () => ({
  decode: jest.fn(),
}));
