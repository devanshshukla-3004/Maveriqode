import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './admin/AdminApp.tsx';
import { supabase } from './lib/supabase';
import './index.css';

const isAdminRoute = window.location.pathname.replace(/\\/+$/, '') === '/admin';
document.documentElement.classList.toggle('admin-document', isAdminRoute);

if (!isAdminRoute) {
  void supabase.from('website_content')
    .select('seo_title, seo_description')
    .eq('slug', 'site-seo')
    .eq('status', 'published')
    .maybeSingle()
    .then(({ data }) => {
      if (!data) return;
      if (data.seo_title) {
        document.title = data.seo_title;
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', data.seo_title);
      }
      if (data.seo_description) {
        document.querySelector('meta[name="description"]')?.setAttribute('content', data.seo_description);
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', data.seo_description);
      }
    });
}

createRoot(document.getElementById('root')!).render(isAdminRoute ? <AdminApp /> : <App />);
