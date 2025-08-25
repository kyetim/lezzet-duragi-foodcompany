// Stub replacement for lucide-react chrome icon to avoid antivirus false positive
import React from 'react';

// Create a simple replacement icon that looks similar to Chrome
const Chrome = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => 
  React.createElement('svg', {
    ref,
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props
  }, [
    React.createElement('circle', { key: '1', cx: 12, cy: 12, r: 10 }),
    React.createElement('circle', { key: '2', cx: 12, cy: 12, r: 4 }),
    React.createElement('path', { key: '3', d: 'M12 8v8' }),
    React.createElement('path', { key: '4', d: 'm8 12 8 0' })
  ])
);

Chrome.displayName = "Chrome";

// Export the same structure as the original chrome.js file
export { Chrome as default };
export const ChromeIcon = Chrome;
export const LucideChrome = Chrome;