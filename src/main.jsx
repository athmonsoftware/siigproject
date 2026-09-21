import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')
const AdminPanel = lazy(() => import('./AdminPanel.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading admin panel…</main>}><AdminPanel /></Suspense> : <App />}
  </React.StrictMode>,
)
