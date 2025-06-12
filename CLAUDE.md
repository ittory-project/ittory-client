# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint and Stylelint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - Run TypeScript type checking
- `npm run storybook` - Start Storybook development server

## Architecture Overview

This is a React + TypeScript application built with Vite for a collaborative letter-writing platform called "Ittory".

### State Management
- **Redux Toolkit** with persistence for letter writing data and order management
- **React Query (TanStack Query)** for server state management and API calls
- **Redux Persist** for maintaining write/order data across sessions

### Key Application Flow
The app follows a collaborative letter-writing workflow:
1. **Create** - User creates a letter and invites participants
2. **Invite/Join** - Other users join the letter creation process
3. **Write** - Participants write in a predetermined order
4. **Share/Receive** - Final letter is shared and received

### WebSocket Integration
- Custom type-safe WebSocket wrapper (`SharedTypeSafeWebSocket`) built on STOMP
- Real-time collaboration features for letter writing
- Automatic reconnection and subscription management
- Queue-based message handling for connection reliability

### API Layer Structure
- **Services** - Business logic layer (AuthService, LetterService, etc.)
- **Models** - TypeScript interfaces for API data
- **Queries** - React Query hooks organized by domain
- **Config** - API configuration, interceptors, and token management

### Mobile-First Design
- Built as a web app designed for mobile webview integration
- iOS SafeArea handling
- React Native WebView console logging integration
- Responsive design with viewport height calculations

### Development Tools
- **MSW (Mock Service Worker)** for API mocking during development
- **Storybook** for component development and documentation
- **Sentry** for error tracking
- **Hotjar** for user analytics (production only)
- **Lefthook** for git hooks with commitlint

### Environment Configuration
Required environment variables:
- `VITE_DEPLOY_ENV` - Deployment environment
- `VITE_KAKAO_KEY` - Kakao OAuth key
- `VITE_SERVER_URL` - Backend API URL
- `VITE_SENTRY_DSN` - Sentry DSN (optional)
- `VITE_HOTJAR_SITE_ID` - Hotjar site ID (optional)

### Key Directories
- `src/pages/` - Top-level route components
- `src/components/` - Reusable UI components organized by page
- `src/api/` - API layer (services, models, queries, websockets)
- `src/utils/SessionLogger/` - Custom logging system for debugging
- `src/layout/` - App layout components with mobile-specific features