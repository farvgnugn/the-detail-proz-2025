// Business configuration constants
export const BUSINESS_CONFIG = {
  phone: {
    number: '9033996021',
    formatted: '(903) 399-6021',
    link: 'tel:+19033996021'
  },
  name: 'The Detail Proz',
  email: 'info@thedetailproz.com',
  serviceArea: 'East Texas',
  // Google Places configuration
  googlePlaces: {
    // You'll need to replace these with your actual values
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '',
    placeId: import.meta.env.VITE_GOOGLE_PLACE_ID || ''
  }
};