import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes,
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URLs
  const generateOptimizedUrls = (originalSrc: string, targetWidth?: number, targetHeight?: number) => {
    // For Unsplash images, use their optimization parameters
    if (originalSrc.includes('unsplash.com')) {
      const baseUrl = originalSrc.split('?')[0];
      const w = targetWidth || width || 800;
      const h = targetHeight || height || 600;
      
      return {
        webp: `${baseUrl}?w=${w}&h=${h}&fit=crop&auto=format&fm=webp&q=80`,
        avif: `${baseUrl}?w=${w}&h=${h}&fit=crop&auto=format&fm=avif&q=80`,
        fallback: `${baseUrl}?w=${w}&h=${h}&fit=crop&auto=format&q=85`
      };
    }
    
    // For other images, return as-is (you could implement other CDN optimizations here)
    return {
      webp: originalSrc,
      avif: originalSrc,
      fallback: originalSrc
    };
  };

  const urls = generateOptimizedUrls(src, width, height);

  useEffect(() => {
    // Preload critical images
    if (priority) {
      setCurrentSrc(urls.fallback);
      return;
    }

    // Progressive enhancement: try modern formats first
    const testWebP = () => {
      return new Promise<boolean>((resolve) => {
        const webp = new Image();
        webp.onload = webp.onerror = () => resolve(webp.height === 2);
        webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    };

    const testAVIF = () => {
      return new Promise<boolean>((resolve) => {
        const avif = new Image();
        avif.onload = avif.onerror = () => resolve(avif.height === 2);
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      });
    };

    // Determine best format
    (async () => {
      try {
        const [supportsAVIF, supportsWebP] = await Promise.all([testAVIF(), testWebP()]);
        
        if (supportsAVIF) {
          setCurrentSrc(urls.avif);
        } else if (supportsWebP) {
          setCurrentSrc(urls.webp);
        } else {
          setCurrentSrc(urls.fallback);
        }
      } catch {
        setCurrentSrc(urls.fallback);
      }
    })();
  }, [src, priority, urls.avif, urls.webp, urls.fallback]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (currentSrc !== urls.fallback) {
      // Fallback to original format
      setCurrentSrc(urls.fallback);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ width, height }}
      >
        Görsel yüklenemedi
      </div>
    );
  }

  return (
    <picture>
      {/* Next-gen formats */}
      {urls.avif !== urls.fallback && (
        <source srcSet={urls.avif} type=\"image/avif\" />
      )}
      {urls.webp !== urls.fallback && (
        <source srcSet={urls.webp} type=\"image/webp\" />
      )}
      
      {/* Fallback */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        decoding=\"async\"
        style={{
          objectFit: 'cover',
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </picture>
  );
};

// Utility function for generating responsive image URLs
export const generateResponsiveSizes = (breakpoints: { mobile: number; tablet: number; desktop: number }) => {
  return `(max-width: 768px) ${breakpoints.mobile}px, (max-width: 1024px) ${breakpoints.tablet}px, ${breakpoints.desktop}px`;
};