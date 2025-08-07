# Dual Upload System: Cloudinary + ImageKit

This project uses a smart dual upload system that automatically routes PDF files to the most appropriate storage service based on file size.

## System Overview

### File Size Routing

- **PDFs < 10MB**: Uploaded to **Cloudinary**
- **PDFs 10MB - 25MB**: Uploaded to **ImageKit**
- **PDFs > 25MB**: Rejected with error message

### Why Two Services?

1. **Cost Optimization**: Different services have different pricing models and free tier limits
2. **Performance**: Each service is optimized for different use cases
3. **Reliability**: Redundancy across multiple providers
4. **Feature Optimization**: Leverage the best features of each service

## Service Comparison

| Feature | Cloudinary | ImageKit |
|---------|------------|----------|
| **Free Storage** | 25GB | 3GB |
| **Free Bandwidth** | 25GB/month | 20GB/month |
| **Max File Size** | 100MB | 25MB |
| **CDN** | Global CDN | Global CDN |
| **Transformations** | Advanced | Basic |
| **API Complexity** | Simple | Moderate |

## How It Works

### 1. File Upload Process

```typescript
// Automatic routing based on file size
if (fileSize < 10MB) {
  // Upload to Cloudinary
  result = await cloudinaryService.uploadPDF(file);
} else if (fileSize <= 25MB) {
  // Upload to ImageKit
  result = await imagekitService.uploadPDF(file);
} else {
  // Reject file
  throw new Error('File too large');
}
```

### 2. Metadata Storage

All files are stored in Firebase Firestore with metadata including:

```typescript
{
  id: "unique_id",
  title: "Document Title",
  pdfUrl: "https://...", // Direct file URL
  uploadProvider: "cloudinary" | "imagekit",
  cloudinaryPublicId: "abc123", // If Cloudinary
  imagekitFileId: "xyz789", // If ImageKit
  fileSize: 5242880, // Bytes
  // ... other metadata
}
```

### 3. File Retrieval

```typescript
// Smart URL generation based on provider
const optimizedUrl = uploadService.getOptimizedUrl(pdf);
const downloadUrl = uploadService.getDownloadUrl(pdf);
```

## Setup Requirements

### Environment Variables

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# ImageKit Configuration  
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key
VITE_IMAGEKIT_PRIVATE_KEY=your_private_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id/
```

### Setup Guides

- [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md)
- [ImageKit Setup Guide](./IMAGEKIT_SETUP.md)

## Architecture

### Services Structure

```
src/services/
├── cloudinaryService.ts     # Cloudinary integration
├── imagekitService.ts       # ImageKit integration
├── pdfUploadService.ts      # Smart routing logic
└── index.ts                 # Service exports
```

### Key Components

1. **cloudinaryService**: Handles files < 10MB
2. **imagekitService**: Handles files 10MB-25MB
3. **pdfUploadService**: Smart routing and unified interface
4. **React Hooks**: Integration with React Query for state management

## User Experience

### Upload Flow

1. User selects PDF file
2. System shows which service will be used
3. File validates against size limits
4. Upload progress tracked
5. Success/error feedback provided

### Visual Indicators

- File size display
- Service selection indicator
- Upload progress
- Error messages with specific guidance

## Error Handling

### File Size Errors

```typescript
// Too small for ImageKit
if (size < 10MB && targetService === 'imagekit') {
  throw new Error('File must be at least 10MB for ImageKit');
}

// Too large overall
if (size > 25MB) {
  throw new Error('File must be less than 25MB');
}
```

### Service-Specific Errors

- **Cloudinary**: Preset configuration, API limits
- **ImageKit**: Authentication, storage limits
- **Network**: Connection issues, timeouts

## Performance Considerations

### Upload Speed

- Cloudinary: Generally faster for smaller files
- ImageKit: Optimized for larger files
- Both use global CDNs for fast delivery

### Bandwidth Usage

- Files < 10MB: Count against Cloudinary limits
- Files 10MB+: Count against ImageKit limits
- Smart distribution helps balance usage

## Security

### Frontend Security

- Unsigned uploads for simplicity
- File type validation
- Size limit enforcement
- CORS configuration required

### Production Security

Consider implementing:
- Signed uploads via backend
- File content scanning
- User authentication checks
- Rate limiting

## Monitoring

### Usage Tracking

```typescript
// Each service tracks its usage
const stats = {
  cloudinaryUploads: await getCloudinaryStats(),
  imagekitUploads: await getImageKitStats(),
  totalStorage: cloudinaryStorage + imagekitStorage
};
```

### Health Checks

- Service availability monitoring
- Upload success rates
- Error rate tracking
- Performance metrics

## Migration and Backup

### Data Portability

Each PDF document includes:
- Original provider information
- Direct file URLs
- Provider-specific IDs for management

### Backup Strategy

1. Firestore metadata automatically backed up
2. File URLs remain accessible via original providers
3. Migration scripts can move files between services if needed

## Cost Management

### Free Tier Optimization

- Cloudinary: 25GB storage, 25GB bandwidth
- ImageKit: 3GB storage, 20GB bandwidth
- Smart routing maximizes free usage

### Scaling Strategy

1. Monitor usage across both services
2. Upgrade services as needed
3. Consider enterprise features
4. Implement cost alerts

## Development

### Local Development

1. Set up both Cloudinary and ImageKit accounts
2. Configure environment variables
3. Test with various file sizes
4. Monitor console logs for routing decisions

### Testing

```typescript
// Test file size routing
describe('File Size Routing', () => {
  it('routes small files to Cloudinary', () => {
    const file = createMockFile(5 * 1024 * 1024); // 5MB
    expect(getUploadService(file)).toBe('cloudinary');
  });
  
  it('routes large files to ImageKit', () => {
    const file = createMockFile(15 * 1024 * 1024); // 15MB
    expect(getUploadService(file)).toBe('imagekit');
  });
});
```

## Future Enhancements

### Potential Improvements

1. **Dynamic Routing**: Based on current usage/costs
2. **Compression**: Automatic file size optimization
3. **Thumbnails**: PDF preview generation
4. **Analytics**: Detailed usage analytics
5. **Admin Dashboard**: Service switching controls

### Scalability

- Add more storage providers
- Implement load balancing
- Add geographic routing
- Enterprise features integration

## Troubleshooting

### Common Issues

1. **Upload fails silently**: Check console for error messages
2. **Wrong service selected**: Verify file size calculation
3. **Environment variables**: Ensure all required vars are set
4. **CORS errors**: Check service CORS configuration

### Debug Tools

- Browser console logs
- Network tab for upload requests
- Service dashboard metrics
- Firestore document inspection

This dual upload system provides a robust, cost-effective solution for PDF storage with automatic optimization and excellent user experience.
