// Email service for sending access request notifications
// This can be configured to work with different email providers
import emailjs from 'emailjs-com';

interface EmailData {
  name: string;
  email: string;
  reason: string;
}

interface CategoryRequestData {
  name: string;
  email: string;
  categoryName: string;
  description: string;
  examples: string;
}

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private static readonly ADMIN_EMAIL = 'ashinjiyostudy@gmail.com'; // Replace with your actual email
  private static readonly API_ENDPOINT = '/api/send-email'; // Your backend email endpoint

  // Method 1: Using EmailJS (Client-side solution - easier setup)
  static async sendWithEmailJS(data: EmailData): Promise<boolean> {
    try {
      const templateParams = {
        to_email: this.ADMIN_EMAIL,
        from_name: data.name,
        from_email: data.email,
        subject: `New Access Request from ${data.name}`,
        message: `
New access request received:

Name: ${data.name}
Email: ${data.email}
Reason: ${data.reason}

Submitted at: ${new Date().toLocaleString()}
        `
      };

      // Configure EmailJS - using environment variables
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_fn5s7ze';
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_equfrhk';

      console.log('Sending email with EmailJS:', templateParams);

      // EmailJS is already initialized in main.tsx, so we don't need to pass the public key
      const result = await emailjs.send(serviceID, templateID, templateParams);
      console.log('EmailJS result:', result);
      
      return result.status === 200;

    } catch (error) {
      console.error('EmailJS error:', error);
      return false;
    }
  }

  // Method 2: Using your own backend API
  static async sendWithBackend(data: EmailData): Promise<boolean> {
    try {
      const emailConfig: EmailConfig = {
        to: this.ADMIN_EMAIL,
        subject: `New Access Request from ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">New Access Request</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Reason:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${data.reason.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #7f8c8d; font-size: 14px;">
              Submitted at: ${new Date().toLocaleString()}
            </p>
          </div>
        `
      };

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailConfig)
      });

      return response.ok;

    } catch (error) {
      console.error('Backend email error:', error);
      return false;
    }
  }

  // Method 3: Using Formspree (Easy third-party solution)
  static async sendWithFormspree(data: EmailData): Promise<boolean> {
    try {
      // You'll need to set up a form at formspree.io and get your form ID
      const formspreeEndpoint = 'https://formspree.io/f/your-form-id'; // Replace with your Formspree form ID

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: `New Access Request from ${data.name}`,
          message: `
New access request received:

Name: ${data.name}
Email: ${data.email}
Reason: ${data.reason}

Submitted at: ${new Date().toLocaleString()}
          `
        })
      });

      return response.ok;

    } catch (error) {
      console.error('Formspree error:', error);
      return false;
    }
  }

  // Method 4: Using Web3Forms (Another easy third-party solution)
  static async sendWithWeb3Forms(data: EmailData): Promise<boolean> {
    try {
      // Get your access key from https://web3forms.com
      const accessKey = '9e10e2af-a7da-4ae1-8871-fb36e310fc05'; // Replace with your Web3Forms access key

      console.log('Sending email with Web3Forms:', { data, accessKey });

      const payload = {
        access_key: accessKey,
        name: data.name,
        email: data.email,
        to: 'ashinjiyostudy@gmail.com',
        subject: `New Access Request from ${data.name}`,
        message: `
New access request received:

Name: ${data.name}
Email: ${data.email}
Reason: ${data.reason}

Submitted at: ${new Date().toLocaleString()}
        `
      };

      console.log('Sending payload:', payload);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('Response result:', result);
      
      return result.success;

    } catch (error) {
      console.error('Web3Forms error:', error);
      return false;
    }
  }

  // Main method - choose which service to use
  static async sendAccessRequest(data: EmailData): Promise<boolean> {
    // Choose your preferred method:
    
    // Option 1: EmailJS (requires EmailJS setup)
    return await this.sendWithEmailJS(data);
    
    // Option 2: Your own backend (requires backend API)
    // return await this.sendWithBackend(data);
    
    // Option 3: Formspree (easy setup, just need form ID)
    // return await this.sendWithFormspree(data);
    
    // Option 4: Web3Forms (easy setup, just need access key)
    // return await this.sendWithWeb3Forms(data);
    
    // For testing, return true
    // return true;
  }

  // Method for sending category requests
  static async sendCategoryRequest(data: CategoryRequestData): Promise<boolean> {
    try {
      const templateParams = {
        to_email: this.ADMIN_EMAIL,
        from_name: data.name,
        from_email: data.email,
        category_name: data.categoryName,
        category_description: data.description,
        category_examples: data.examples || 'No examples provided',
        subject: `New Category Request: ${data.categoryName}`,
        message: `
New category request received:

Name: ${data.name}
Email: ${data.email}
Category Name: ${data.categoryName}
Description: ${data.description}
Examples: ${data.examples || 'No examples provided'}

Submitted at: ${new Date().toLocaleString()}
        `
      };

      // Use EmailJS with the same configuration as access requests
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_fn5s7ze';
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_equfrhk';

      console.log('Sending category request with EmailJS:', templateParams);

      // EmailJS is already initialized in main.tsx, so we don't need to pass the public key
      const result = await emailjs.send(serviceID, templateID, templateParams);
      console.log('EmailJS result:', result);
      
      return result.status === 200;

    } catch (error) {
      console.error('EmailJS error for category request:', error);
      return false;
    }
  }
}

export default EmailService;
