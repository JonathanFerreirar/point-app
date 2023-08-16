import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/global.css'
import Router from './router.tsx'
import { UserProvider } from './context/pointContext.tsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <Router />
      <Toaster />
    </UserProvider>
  </React.StrictMode>,
)
