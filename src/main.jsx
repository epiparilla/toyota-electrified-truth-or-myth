import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// Kiosk mode: block browser pinch gestures while leaving normal one-finger controls intact.
const preventPinchZoom = (event) => {
  if (event.touches?.length > 1 || event.type.startsWith('gesture')) {
    event.preventDefault()
  }
}

document.addEventListener('gesturestart', preventPinchZoom, { passive: false })
document.addEventListener('gesturechange', preventPinchZoom, { passive: false })
document.addEventListener('gestureend', preventPinchZoom, { passive: false })
document.addEventListener('touchmove', preventPinchZoom, { passive: false })

// The installed Android app already ships its web files inside the APK. Keeping
// the browser service worker for the web/PWA build only prevents an older
// cached web bundle from surviving a native app upgrade.
const isNativeApp = window.Capacitor?.isNativePlatform?.() ?? false

if (!isNativeApp && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error)
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
