import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PersonalityProvider } from './context/PersonalityContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PersonalityProvider>
      <App />
    </PersonalityProvider>
  </React.StrictMode>
)
