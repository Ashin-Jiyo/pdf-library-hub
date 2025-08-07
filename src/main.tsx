import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import emailjs from 'emailjs-com'
import './index.css'
import App from './App.tsx'

// Initialize EmailJS
emailjs.init('_9RGrzGJBHDS-3KMA'); // Replace with your EmailJS public key

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
