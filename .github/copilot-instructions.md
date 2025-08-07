<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Dynamic PDF Library & Content Hub - Copilot Instructions

This is a comprehensive React-based web application for managing and sharing PDF documents with advanced features.

## Project Architecture

- **Frontend**: React 18 + TypeScript + Vite for optimal development experience
- **Styling**: Tailwind CSS for responsive, modern design
- **Backend**: Firebase (Authentication, Firestore, Storage, Cloud Functions)
- **Routing**: React Router for client-side navigation
- **Search**: Algolia or custom full-text search implementation
- **Email**: SendGrid/Mailgun/Resend for notifications

## Key Features to Implement

1. **Core PDF Management**
   - Public PDF display with view/download buttons
   - Admin dashboard with role-based access (admin/root)
   - CRUD operations for PDF metadata
   - Drag-and-drop file uploads

2. **Advanced Features**
   - Full-text PDF search with indexing
   - Categories and tags system
   - User comments and feedback
   - Analytics (view/download tracking)
   - Email notifications for new uploads
   - Rich text descriptions with HTML editor

3. **User Roles**
   - `admin`: Can upload new PDFs
   - `root`: Full CRUD access to all PDFs
   - Public users: View, download, comment on PDFs

## Development Guidelines

- Use TypeScript strictly with proper typing
- Follow React best practices with functional components and hooks
- Implement responsive design using Tailwind CSS
- Create reusable components in `/src/components`
- Organize pages in `/src/pages`
- Use custom hooks for Firebase operations in `/src/hooks`
- Store Firebase configuration in `/src/config`
- Implement proper error handling and loading states
- Add accessibility features (ARIA labels, keyboard navigation)

## File Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-based page components
├── hooks/              # Custom React hooks
├── services/           # Firebase and external API services
├── config/             # Configuration files
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## Firebase Collections Structure

- `pdfs`: Main PDF metadata collection
- `users`: User profiles and roles
- `comments`: User comments on PDFs
- `categories`: PDF categories
- `subscriptions`: Email notification preferences

When generating code, prioritize:
1. Type safety and proper TypeScript usage
2. Responsive design with Tailwind CSS
3. Accessibility features
4. Performance optimization
5. Security best practices for Firebase
6. Clean, maintainable code structure
