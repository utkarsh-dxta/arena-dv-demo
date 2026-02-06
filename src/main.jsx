import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize MoEngage Web SDK
import Moengage from '@moengage/web-sdk';

Moengage.initialize({
  "app_id": "C222LCLH9PT3KXAGPXWQCF24",
  "cluster": "DC_1",
  "debug_logs": 0,
  "disable_onsite": true,
  "disable_web_push": true,
  "useLatest": true
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
