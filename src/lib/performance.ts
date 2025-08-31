// Performance monitoring utility for Core Web Vitals

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
              this.metrics.FID = (entry as any).processingStart - entry.startTime;
              this.reportMetric('FID', this.metrics.FID);
              break;
              
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                this.metrics.CLS = (this.metrics.CLS || 0) + (entry as any).value;
                this.reportMetric('CLS', this.metrics.CLS);
              }
              break;
          }
        }
      });

      // Observe different entry types
      this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      // Fallback for browsers that don't support all entry types
      if (typeof console !== 'undefined') {
        console.warn('Performance Observer initialization failed:', error);
      }
    }
  }

  private measureTTFB() {
    if (typeof window === 'undefined' || !window.performance || !window.performance.timing) {
      return;
    }

    const timing = window.performance.timing;
    if (timing.responseStart && timing.requestStart) {
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
        console.warn(`Custom metric measurement failed for ${name}:`, error);
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