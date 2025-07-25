import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Function to mount the React app
function mountReactApp() {
  const rootElement = document.getElementById('root') || document.getElementById('react-checkout-root')
  
  if (rootElement) {
    try {
      ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      )
      console.log('✅ React app mounted successfully')
      
      // Expose global functions for direct integration
      if (window.parent !== window) {
        // We're in an iframe, expose functions to parent
        window.parent.postMessage({
          type: 'REACT_APP_READY',
          data: {
            updateCartData: true,
            isReactAppReady: true
          }
        }, '*')
      } else {
        // We're embedded directly, expose functions globally
        console.log('🚀 React app embedded directly - global functions will be exposed by App component')
      }
    } catch (error) {
      console.error('❌ Error mounting React app:', error)
    }
  } else {
    console.warn('⚠️ No root element found for React app')
  }
}

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountReactApp)
} else {
  mountReactApp()
}