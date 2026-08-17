import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import { AdminAuthProvider } from './context/AdminAuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <AppRouter />
    </AdminAuthProvider>
  </React.StrictMode>
);