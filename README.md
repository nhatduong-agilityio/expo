# News App

## 📱 Overview

This document provides information about React Native Expo practice one.

## ✨ Features

- **Authentication**
  - Sign In / Sign Up functionality
  - Secure user session management

- **Posts Management**
  - Paginated posts list (100+ items)
  - Search posts
  - Filter posts by categories
  - Create new posts
  - Bookmark favorite posts

- **Profile**
  - View and edit user profile
  - Change avatar using Camera or Image Picker
  - Profile settings management

- **UI/UX**
  - Custom splash screen
  - Custom app icon
  - Accessibility support
  - Platform-specific optimizations (Android & iOS)

## 🛠 Technical Stack

- **React Native & Expo**
- **React**
- **TypeScript**
- **Zustand**
- **React Query**
- **React Hook Form**
- **React Native Unistyles**
- **Storybook**
- **Jest & React Native Testing Library**
- **ESLint & Prettier**
- **Husky**

## 📂 Project Structure

```
news-app/
├── app/                    # App router screens
├── assets/                 # Images, fonts, and other static files
├── components/             # Reusable components
├── constants/              # App constants and configuration
├── hooks/                  # Custom React hooks
├── mocks/                  # Mock data
├── services/               # API services
├── stores/                 # State management stores
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── .editorconfig           # Editor configuration
├── .gitignore              # Git ignore rules
├── .lintstagedrc.js        # Lint-staged configuration
├── .prettierrc             # Prettier configuration
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── eas.json                # EAS configuration
├── eslint.config.js        # ESLint configuration
├── index.ts                # Entry point
├── jest.config.js          # Jest configuration
├── jest.setup.ts           # Jest setup
├── metro.config.js         # Metro bundler configuration
├── news-app.sql            # Database schema
├── package.json            # Dependencies
├── storage-setup.sql       # Storage setup
├── tsconfig.json           # TypeScript configuration
├── unistyles.ts            # Unistyles configuration
├── yarn.lock               # Yarn lock file
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Clone the repository:

```bash
git@gitlab.asoft-python.com:nhat.duong/react-native-training.git
```

and

```bash
git checkout expo-practice-one
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create your **.env** file:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

4. Start the development server:

```bash
npx expo start
```

5. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 🧪 Testing

Run unit tests:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

## 📚 Storybook

Launch Storybook for component development:

```bash
npm run storybook
# or
yarn storybook
```

## 🎨 Code Quality

Format code:

```bash
npm run format
# or
yarn format
```

Lint code:

```bash
npm run lint
# or
yarn lint
```

## 📅 Timeline

- **Estimation**: November 5, 2025 - November 13, 2025 (7 days)
- **Started**: November 4, 2025

## 🎯 Project Goals

- ✅ Handle platform differences between Android and iOS
- ✅ Achieve >80% unit test coverage
- ✅ Custom app icon and splash screen
- ✅ Authentication screens (Login/Signup)
- ✅ Home screen with 100+ paginated items
- ✅ Profile screen with camera/image picker integration
- ✅ Accessibility compliance

## 📝 Design

Design specifications can be found at: [Design Link](https://www.figma.com/design/TdbzhXYFUNAW3vjyUc5aKt/News-App-UI-Kit--Community-?node-id=0-1&t=9f9b56y6ptuOSdWd-1)

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- 1 Developer: [Nhat Duong Cong](mailto:nhat.duong@asnet.com.vn)

- GitLab: [@nhat.duong](https://gitlab.asoft-python.com/nhat.duong)

- Slack: nhat.duong

---

Built with ❤️ using Expo and React Native
