import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Save, Check, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { BusinessSettings } from '../../lib/supabase';

const BusinessSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setError('');
      // Check if Supabase is configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setError('Supabase not configured. Please set up your database connection.');
        return;
      }
      
      try {
        const data = await adminService.getBusinessSettings();
        setSettings(data);
      } catch (dbError: any) {
        // If no settings exist, create default ones
        if (dbError.message?.includes('No rows')) {
          setSettings({
            id: 'default',
            phone_number: '9033996021',
            phone_formatted: '(903) 399-6021',
            phone_link: 'tel:+19033996021',
            email: 'info@thedetailproz.com',
            updated_at: new Date().toISOString()
          });
        } else {
          throw dbError;
        }
      }
    } catch (error) {
      console.error('Error loading business settings:', error);
      setError('Failed to load business settings. Please check your Supabase connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handlePhoneChange = (value: string) => {
    if (!settings) return;
    
    const cleaned = value.replace(/\D/g, '');
    const formatted = formatPhoneNumber(cleaned);
    const link = `tel:+1${cleaned}`;
    
    setSettings({
      ...settings,
      phone_number: cleaned,
      phone_formatted: formatted,
      phone_link: link,
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    setSaveStatus('idle');
    setError('');
    
    try {
      await adminService.updateBusinessSettings(settings);
      setSaveStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadSettings}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-2 rounded-lg">
            <Phone size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Business Settings
            </h2>
            <p className="text-sm text-gray-600">Manage your contact information</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={settings?.phone_number || ''}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Enter phone number"
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter 10 digits (e.g., 9033996021). Formatting will be applied automatically.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Business Email Address
              </label>
              <input
                type="email"
                id="email"
                value={settings?.email || ''}
                onChange={(e) => settings && setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="info@thedetailproz.com"
              />
              <p className="mt-2 text-sm text-gray-500">
                This email will receive form submissions from the "Get Free Estimate" form.
              </p>
            </div>

            {settings && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Formatted Display:</span>
                    <span className="font-medium">{settings.phone_formatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click-to-Call Link:</span>
                    <span className="font-medium text-purple-600">{settings.phone_link}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact Email:</span>
                    <span className="font-medium">{settings.email}</span>
                  </div>
                </div>
              </div>
            )}

            {saveStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
              >
                <Check size={16} />
                <span>Settings saved successfully!</span>
              </motion.div>
            )}

            {saveStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <AlertCircle size={16} />
                <span>{error || 'Failed to save settings. Please try again.'}</span>
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving || !settings}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettingsPanel;