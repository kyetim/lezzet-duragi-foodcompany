import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'restaurant';
  structuredData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Lezzet Durağı - Döner & Makarna',
  description = "Mersin'in en lezzetli döner ve makarna siparişleri. Hızlı teslimat, güvenli ödeme.",
  keywords = 'döner, makarna, restoran, mersin, yemek, sipariş, online, teslimat',
  image = '/icons/icon-512x512.png',
  url = 'https://lezzet-duragi.vercel.app',
  type = 'website',
  structuredData
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', `${url}${image}`, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${url}${image}`);
    
    // Structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, image, url, type, structuredData]);
  
  return null;
};

// Sayfa-özel SEO bileşenleri
export const HomePageSEO: React.FC = () => (
  <SEO
    title="Lezzet Durağı - Mersin'in En Lezzetli Döner ve Makarna Restoranı"
    description="Mersin'de taze malzemelerle hazırlanan döner ve makarna siparişi verin. Hızlı teslimat, uygun fiyatlar ve güvenli ödeme seçenekleri."
    keywords="mersin döner, makarna siparişi, online yemek, restoran mersin, döner teslimat"
  />
);

export const MenuPageSEO: React.FC = () => (
  <SEO
    title="Menümüz - Lezzet Durağı Döner ve Makarna Çeşitleri"
    description="Lezzet Durağı'nın zengin menüsünü keşfedin. Döner çeşitleri, İtalyan makarna, salatalar ve içeceklerimizi görüntüleyin."
    keywords="döner menüsü, makarna çeşitleri, yemek menüsü, fiyat listesi"
    type="website"
  />
);

export const CheckoutPageSEO: React.FC = () => (
  <SEO
    title="Sipariş Tamamla - Güvenli Ödeme | Lezzet Durağı"
    description="Siparişinizi güvenli ödeme seçenekleri ile tamamlayın. Kredi kartı, havale ve kapıda ödeme imkanları."
    keywords="online ödeme, güvenli ödeme, sipariş tamamlama, kredi kartı"
    type="website"
  />
);