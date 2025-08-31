import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initPerformanceMonitor, measurePageLoad } from '@/lib/performance'
import './index.css'
import App from './App.tsx'

// Initialize performance monitoring immediately
const performanceMonitor = initPerformanceMonitor();
measurePageLoad();

// Mark critical path start
performanceMonitor.markCustomMetric('app-initialization-start');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Mark critical path end
performanceMonitor.measureCustomMetric('app-initialization-time', 'app-initialization-start');
