import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import emailjs from 'emailjs-com'
import './index.css'
import App from './App.tsx'

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '_9RGrzGJBHDS-3KMA');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
