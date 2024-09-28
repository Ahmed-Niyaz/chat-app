import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import SocketProvider from './SocketContext/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <SocketProvider>
    <App />
    </SocketProvider>
  </Router>
)
