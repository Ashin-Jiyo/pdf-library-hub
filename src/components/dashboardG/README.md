# Guest Dashboard

## Overview
The Guest Dashboard is a simplified dashboard interface designed specifically for users who need to upload PDFs but don't require full administrative capabilities. It provides a streamlined experience focused solely on the upload functionality.

## Features
- **Upload Only Interface**: Clean, focused UI with only the upload tab available
- **Green Theme**: Uses green color scheme to differentiate from the main admin dashboard (blue theme)
- **File & Link Upload**: Supports both direct file uploads and PDF links
- **Category Selection**: Allows users to categorize their uploads
- **Tag Management**: Users can add tags to their PDFs for better organization
- **Responsive Design**: Mobile-friendly interface
- **Authentication Required**: Protected route requiring user login

## Components

### GuestDashboardLayout
- Simplified sidebar with only upload navigation
- Green-themed design
- Mobile-responsive sidebar
- Quick access to main site and sign out

### GuestUpload
- Dual upload modes: file upload and link sharing
- Form validation and error handling
- Auto-population of metadata from file names
- Support for multiple categories and tags
- Progress indicators and loading states

## Navigation
- **Route**: `/guest-dashboard`
- **Access**: Available to authenticated users
- **Navigation**: Accessible via "Guest Upload" link in main navbar

## Usage
1. User logs in to the application
2. Navigates to "Guest Upload" from the main navbar
3. Lands on the upload interface (homepage of guest dashboard)
4. Can upload PDFs via file or link
5. Fills in metadata (title, author, description, category, tags)
6. Submits the upload

## Technical Details
- Built with React + TypeScript
- Uses Firebase for authentication and storage
- Integrates with existing PDF upload services (Cloudinary/ImageKit)
- Follows the same data models as the main dashboard
- Responsive design with Tailwind CSS
