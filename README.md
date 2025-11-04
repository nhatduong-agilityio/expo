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
├── scripts/                # Build and utility scripts
├── .storybook/            # Storybook configuration
├── __tests__/             # Test files
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
└── README.md             # This file
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

3. Start the development server:

```bash
npx expo start
```

4. Run on your preferred platform:
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
