// Performance monitoring utility for Core Web Vitals

// TypeScript interface for Navigation Timing API
interface PerformanceNavigationTiming extends PerformanceEntry {
  unloadEventStart: number;
  unloadEventEnd: number;
  domInteractive: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
  type: string;
  redirectCount: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  secureConnectionStart: number;
}

export interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeObserver();
    this.measureTTFB();
  }

  private initializeObserver() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Check which entry types are supported
      const supportedEntryTypes = [];
      const testTypes = ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'];
      
      for (const type of testTypes) {
        if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
          supportedEntryTypes.push(type);
        }
      }

      if (supportedEntryTypes.length === 0) {
        // Fallback: try to observe all types anyway
        supportedEntryTypes.push(...testTypes);
      }

      // Observe paint metrics (FCP, LCP)
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                this.metrics.FCP = entry.startTime;
                this.reportMetric('FCP', entry.startTime);
              }
              break;
              
            case 'largest-contentful-paint':
              this.metrics.LCP = entry.startTime;
              this.reportMetric('LCP', entry.startTime);
              break;
              
            case 'first-input':
              const fidValue = (entry as any).processingStart - entry.startTime;
              if (fidValue >= 0) {
                this.metrics.FID = fidValue;
                this.reportMetric('FID', this.metrics.FID);
              }
              break;
              
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                const currentCLS = this.metrics.CLS || 0;
                const newCLS = currentCLS + (entry as any).value;
                this.metrics.CLS = newCLS;
                this.reportMetric('CLS', newCLS);
              }
              break;
          }
        }
      });

      // Observe supported entry types
      this.observer.observe({ entryTypes: supportedEntryTypes });
    } catch (error) {
      // Fallback for browsers that don't support all entry types
      if (typeof console !== 'undefined') {
        console.warn('Performance Observer başlatılamadı:', error);
      }
    }
  }

  private measureTTFB() {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    // Modern navigation timing API
    if (window.performance.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const navEntry = navEntries[0];
        if (navEntry.responseStart && navEntry.requestStart) {
          this.metrics.TTFB = navEntry.responseStart - navEntry.requestStart;
          this.reportMetric('TTFB', this.metrics.TTFB);
          return;
        }
      }
    }

    // Fallback to legacy timing API
    const timing = window.performance.timing;
    if (timing && timing.responseStart && timing.requestStart) {
      this.metrics.TTFB = timing.responseStart - timing.requestStart;
      this.reportMetric('TTFB', this.metrics.TTFB);
    }
  }

  private reportMetric(name: string, value: number) {
    // Report to analytics (Google Analytics 4)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'core_web_vitals', {
        metric_name: name,
        metric_value: Math.round(value),
        custom_parameter: name
      });
    }

    // Console log for development (removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${name}: ${Math.round(value)}ms`);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public markCustomMetric(name: string) {
    if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  }

  public measureCustomMetric(name: string, startMark: string, endMark?: string) {
    if (typeof window === 'undefined' || !window.performance || !window.performance.measure) {
      return;
    }

    try {
      const endMarkName = endMark || `${startMark}-end`;
      window.performance.mark(endMarkName);
      window.performance.measure(name, startMark, endMarkName);
      
      const measure = window.performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        this.reportMetric(name, measure.duration);
      }
    } catch (error) {
      if (typeof console !== 'undefined') {
        console.warn(`Özel metrik ölçümü başarısız oldu: ${name}:`, error);
      }
    }
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export const initPerformanceMonitor = (): PerformanceMonitor => {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
};

export const getPerformanceMonitor = (): PerformanceMonitor | null => {
  return performanceMonitor;
};

// Utility functions for common performance measurements
export const measurePageLoad = () => {
  const monitor = getPerformanceMonitor();
  if (monitor) {
    monitor.markCustomMetric('page-load-start');
    
    // Measure when page is fully loaded
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        monitor.measureCustomMetric('page-load-time', 'page-load-start');
      });
    }
  }
};

export const measureComponentRender = (componentName: string) => {
  const monitor = getPerformanceMonitor();
  if (monitor) {
    monitor.markCustomMetric(`${componentName}-render-start`);
    
    // Return a function to mark the end
    return () => {
      monitor.measureCustomMetric(`${componentName}-render-time`, `${componentName}-render-start`);
    };
  }
  return () => {}; // No-op function
};