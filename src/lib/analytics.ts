// Analytics configuration
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export const initializeAnalytics = (): void => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn('🔍 Google Analytics: Measurement ID bulunamadı');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
  console.log('📊 Analytics initialized');
};

export const trackPageView = (path: string): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: path });
  }
};

export const trackEvent = (action: string, category: string, label?: string): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

export const trackPurchase = (transactionId: string, value: number): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'TRY'
    });
  }
};

// Declare global gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}