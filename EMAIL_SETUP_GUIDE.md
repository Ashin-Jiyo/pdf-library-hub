# Email Service Setup Guide

This guide explains how to set up email notifications for access requests in your PDF Library Hub.

## Quick Setup Options (Recommended)

### Option 1: Web3Forms (Easiest - Free)

1. **Sign up at [Web3Forms](https://web3forms.com)**
2. **Get your access key** from the dashboard
3. **Update the email service:**
   ```typescript
   // In src/services/emailService.ts, update line 149:
   const accessKey = 'your-actual-access-key-here';
   ```
4. **Set your email** in the Web3Forms dashboard to receive notifications
5. **Test the form** - it should now send emails to your configured email address

### Option 2: Formspree (Easy - Free tier available)

1. **Sign up at [Formspree](https://formspree.io)**
2. **Create a new form** and get your form ID
3. **Update the email service:**
   ```typescript
   // In src/services/emailService.ts, update line 109:
   const formspreeEndpoint = 'https://formspree.io/f/your-actual-form-id';
   ```
4. **Change the main method:**
   ```typescript
   // In src/services/emailService.ts, line 173, change to:
   return await this.sendWithFormspree(data);
   ```

## Advanced Setup Options

### Option 3: EmailJS (Client-side)

1. **Install EmailJS:**
   ```bash
   npm install emailjs-com
   ```

2. **Sign up at [EmailJS](https://www.emailjs.com)**

3. **Create an email service** (Gmail, Outlook, etc.)

4. **Create an email template** with these variables:
   - `{{to_email}}`
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`

5. **Update the email service:**
   ```typescript
   // Add import at top of src/services/emailService.ts:
   import emailjs from 'emailjs-com';
   
   // Update these values in the sendWithEmailJS method:
   const serviceID = 'your_actual_service_id';
   const templateID = 'your_actual_template_id';
   const publicKey = 'your_actual_public_key';
   
   // Uncomment this line:
   const result = await emailjs.send(serviceID, templateID, templateParams, publicKey);
   return result.status === 200;
   ```

6. **Change the main method:**
   ```typescript
   // In src/services/emailService.ts, line 173, change to:
   return await this.sendWithEmailJS(data);
   ```

### Option 4: Custom Backend API

1. **Create a backend endpoint** that accepts POST requests to `/api/send-email`

2. **Your backend should:**
   - Accept JSON with `to`, `subject`, and `html` fields
   - Use a service like SendGrid, Mailgun, or Nodemailer
   - Return 200 on success

3. **Update the email service:**
   ```typescript
   // In src/services/emailService.ts, update line 12:
   private static readonly ADMIN_EMAIL = 'your-actual-email@example.com';
   
   // Update line 13 with your backend URL:
   private static readonly API_ENDPOINT = 'https://your-backend.com/api/send-email';
   ```

4. **Change the main method:**
   ```typescript
   // In src/services/emailService.ts, line 173, change to:
   return await this.sendWithBackend(data);
   ```

## Configuration Steps

### 1. Set Your Admin Email

Update the admin email address in `src/services/emailService.ts`:

```typescript
private static readonly ADMIN_EMAIL = 'your-actual-email@example.com';
```

### 2. Choose Your Email Service

In the `sendAccessRequest` method, uncomment your preferred option:

```typescript
// Choose ONE of these:
return await this.sendWithWeb3Forms(data);      // Recommended for beginners
// return await this.sendWithFormspree(data);   // Alternative easy option
// return await this.sendWithEmailJS(data);     // For more customization
// return await this.sendWithBackend(data);     // For custom backend
```

### 3. Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/guest-login`
3. Click "Request access"
4. Fill out and submit the form
5. Check your email for the notification

## Email Template

The emails will contain:
- **Subject:** "New Access Request from [Name]"
- **Content:**
  - Requester's name and email
  - Reason for access request
  - Timestamp of submission
  - Formatted HTML layout

## Troubleshooting

### Common Issues:

1. **"Failed to send request"**
   - Check your API keys/form IDs
   - Verify internet connection
   - Check browser console for errors

2. **Email not received**
   - Check spam folder
   - Verify email address is correct
   - Test with a simple form first

3. **CORS errors** (EmailJS only)
   - Add your domain to EmailJS settings
   - Use localhost for development

### Testing

For testing purposes, you can temporarily return `true` in the main method:

```typescript
static async sendAccessRequest(data: EmailData): Promise<boolean> {
  console.log('Test email data:', data);
  return true; // Always succeeds for testing
}
```

## Security Notes

- Never expose API keys in client-side code (use environment variables)
- For production, implement rate limiting
- Consider adding CAPTCHA to prevent spam
- Validate and sanitize all form inputs

## Next Steps

After setting up email notifications:
1. Test the form thoroughly
2. Set up email templates for approved/rejected requests
3. Consider adding an admin dashboard to manage requests
4. Implement user notification system for request status updates
