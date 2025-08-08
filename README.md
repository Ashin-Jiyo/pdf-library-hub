# Dynamic PDF Library & Content Hub

🌟 **Live Demo**: [https://ashin-jiyo.github.io/pdf-library-hub/](https://ashin-jiyo.github.io/pdf-library-hub/)

A comprehensive React-based web application for managing and sharing PDF documents with advanced features including full-text search, user comments, analytics, and role-based administration.

## 🚀 Features

### Core Functionality
- **Public PDF Display**: Clean, responsive interface to showcase PDF documents
- **Direct Access**: View PDFs in new tabs and download with one click
- **Secure Dashboard**: Role-based access for admin and root users
- **CRUD Operations**: Complete PDF management system

### Advanced Features
- **Full-Text Search**: Search within PDF content using Algolia
- **Categories & Tags**: Organize PDFs with flexible categorization
- **User Comments**: Community feedback and interaction system
- **Analytics**: Track views, downloads, and user engagement
- **Email Notifications**: Automated alerts for new uploads
- **Rich Text Descriptions**: Enhanced content descriptions with formatting
- **Drag & Drop Upload**: Intuitive file upload experience

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Headless UI
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **State Management**: React Query (TanStack Query)
- **File Storage**: Dual system - Cloudinary + ImageKit
- **Search**: Algolia (planned)
- **Email**: SendGrid/Mailgun (planned)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 💾 Smart File Storage System

This application uses an intelligent dual upload system that automatically routes files to the most appropriate storage service:

### File Size Routing
- **PDFs < 10MB**: Uploaded to **Cloudinary** (fast, cost-effective)
- **PDFs 10MB - 25MB**: Uploaded to **ImageKit** (optimized for larger files)
- **PDFs > 25MB**: Rejected with helpful error message

### Why Two Services?
- **Cost Optimization**: Maximizes free tier limits across services
- **Performance**: Each service optimized for different file sizes
- **Reliability**: Redundancy across multiple CDN providers
- **Scalability**: Easy to adjust routing logic based on usage

### Setup Requirements
- **Cloudinary Account**: For files < 10MB ([Setup Guide](./CLOUDINARY_SETUP.md))
- **ImageKit Account**: For files 10MB-25MB ([Setup Guide](./IMAGEKIT_SETUP.md))
- **Automatic Detection**: System shows which service will be used before upload

📖 **[Complete Dual Upload Documentation](./DUAL_UPLOAD_SYSTEM.md)**

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components
│   ├── dashboard/      # Admin dashboard components
│   ├── filters/        # Search and filter components
│   ├── layout/         # Layout components
│   └── pdf/            # PDF-specific components
├── hooks/              # Custom React hooks
├── pages/              # Route-based page components
├── services/           # External API services
├── config/             # Configuration files
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🔧 Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and other service credentials
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase config to `.env`

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔐 User Roles

- **Admin**: Can upload new PDFs and manage content
- **Root**: Full CRUD access including editing and deleting PDFs
- **Public Users**: Can view, download, and comment on PDFs

## 📝 Development Status

### ✅ Completed (Phase 1)
- Project setup with React + TypeScript + Vite
- Tailwind CSS configuration
- Basic component structure
- Firebase configuration
- Authentication system
- Basic routing with React Router
- Mock data and hooks for development

### 🚧 In Progress (Phase 2)
- Firebase integration
- PDF upload functionality
- Full-text search implementation
- Enhanced UI components

### 📋 Planned (Phase 3)
- Email notification system
- Advanced analytics dashboard
- Comment moderation
- Search optimization
- Performance improvements

## 🚀 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Demo Credentials

For testing the admin dashboard:
- Email: `admin@demo.com`
- Password: `admin123`

---

**Note**: This is a development version. Firebase integration and advanced features are currently being implemented.
