import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './admin/AdminApp.tsx';
import './index.css';

const isAdminRoute = window.location.pathname.replace(/\\/+$/, '') === '/admin';
document.documentElement.classList.toggle('admin-document', isAdminRoute);
createRoot(document.getElementById('root')!).render(isAdminRoute ? <AdminApp /> : <App />);
