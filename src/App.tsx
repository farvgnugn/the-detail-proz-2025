import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BUSINESS_CONFIG } from './config/constants';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import FloatingCallButton from './components/FloatingCallButton';
import ExitIntentPopup from './components/ExitIntentPopup';
import AdminRoute from './components/AdminRoute';

function MainApp() {
  const [businessSettings, setBusinessSettings] = React.useState(BUSINESS_CONFIG.phone);
  const [isAdminRoute, setIsAdminRoute] = React.useState(false);

  React.useEffect(() => {
    // Check if current route is admin
    const path = window.location.pathname;
    setIsAdminRoute(path === '/admin');

    // Load business settings from Supabase (optional - falls back to defaults)
    if (!isAdminRoute) {
      loadBusinessSettings();
    }
  }, [isAdminRoute]);

  const loadBusinessSettings = async () => {
    try {
      // Only try to load from Supabase if we have the environment variables
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('Supabase not configured, using default settings');
        return;
      }

      const { supabase } = await import('./lib/supabase');
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .single();

      if (error) {
        console.log('No business settings found in database, using defaults');
        return;
      }

      if (data) {
        setBusinessSettings({
          number: data.phone_number,
          formatted: data.phone_formatted,
          link: data.phone_link
        });
      }
    } catch (error) {
      console.log('Error loading business settings, using defaults:', error);
      // Keep default settings if database isn't set up yet
    }
  };

  // Handle route changes
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isAdminRoute) {
    return <AdminRoute />;
  }

  return (
    <div className="min-h-screen">
      <Header phone={businessSettings} />
      <Hero phone={businessSettings} />
      <About />
      <Services phone={businessSettings} />
      <Testimonials />
      <Gallery />
      <Contact phone={businessSettings} />
      <FloatingCallButton phone={businessSettings} />
      <ExitIntentPopup phone={businessSettings} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;