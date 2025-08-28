import React, { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';

export const PWATestPage: React.FC = () => {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    install,
    update,
    requestNotificationPermission
  } = usePWA();

  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const runTest = (testName: string, condition: boolean, description: string) => {
    setTestResults(prev => ({ ...prev, [testName]: condition }));
    console.log(`🧪 ${testName}: ${condition ? '✅ PASS' : '❌ FAIL'} - ${description}`);
    return condition;
  };

  const runAllTests = () => {
    console.log('🚀 PWA Functionality Tests başlatılıyor...');
    
    // Test 1: Service Worker Registration
    const swTest = 'serviceWorker' in navigator && 
                   navigator.serviceWorker.controller !== null;
    runTest('serviceWorker', swTest, 'Service Worker kayıtlı ve aktif');

    // Test 2: Manifest Accessibility
    const manifestTest = document.querySelector('link[rel="manifest"]') !== null;
    runTest('manifest', manifestTest, 'Web App Manifest link tag mevcut');

    // Test 3: PWA Icons
    const iconTest = document.querySelector('link[rel="apple-touch-icon"]') !== null;
    runTest('icons', iconTest, 'PWA icons meta tag mevcut');

    // Test 4: Notification API
    const notificationTest = 'Notification' in window;
    runTest('notifications', notificationTest, 'Notification API destekleniyor');

    // Test 5: Network Status Detection
    const networkTest = typeof navigator.onLine === 'boolean';
    runTest('network', networkTest, 'Network status detection çalışıyor');

    // Test 6: Install Prompt
    const installTest = 'BeforeInstallPromptEvent' in window || isInstallable;
    runTest('installPrompt', installTest, 'Install prompt mekanizması mevcut');

    // Test 7: Cache API
    const cacheTest = 'caches' in window;
    runTest('cacheAPI', cacheTest, 'Cache API destekleniyor');

    // Test 8: Background Sync (opsiyonel)
    const syncTest = 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
    runTest('backgroundSync', syncTest, 'Background Sync destekleniyor');

    console.log('🏁 PWA Tests tamamlandı!');
  };

  const TestResult: React.FC<{ name: string; passed: boolean; description: string }> = 
    ({ name, passed, description }) => (
    <div className={`p-3 rounded-lg border ${passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-2">
        <span className={`text-lg ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {passed ? '✅' : '❌'}
        </span>
        <span className="font-medium">{name}</span>
        <span className={`text-sm px-2 py-1 rounded ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {passed ? 'PASS' : 'FAIL'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          🧪 PWA Functionality Test Suite
        </h1>

        {/* PWA Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-lg text-center ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="text-2xl mb-2">{isOnline ? '🌐' : '📱'}</div>
            <div className="font-medium">{isOnline ? 'Online' : 'Offline'}</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${isInstallable ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <div className="text-2xl mb-2">📱</div>
            <div className="font-medium">{isInstallable ? 'Installable' : 'Not Installable'}</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${isInstalled ? 'bg-green-100' : 'bg-gray-100'}`}>
            <div className="text-2xl mb-2">✅</div>
            <div className="font-medium">{isInstalled ? 'Installed' : 'Not Installed'}</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${isUpdateAvailable ? 'bg-yellow-100' : 'bg-gray-100'}`}>
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium">{isUpdateAvailable ? 'Update Available' : 'Up to Date'}</div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={runAllTests}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🧪 Run All Tests
          </button>
          
          <button
            onClick={install}
            disabled={!isInstallable}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            📱 Test Install
          </button>
          
          <button
            onClick={requestNotificationPermission}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            🔔 Test Notifications
          </button>
          
          <button
            onClick={update}
            disabled={!isUpdateAvailable}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            🔄 Test Update
          </button>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-3">
              <TestResult 
                name="Service Worker" 
                passed={testResults.serviceWorker} 
                description="Service Worker kaydedildi ve aktif çalışıyor"
              />
              <TestResult 
                name="Web App Manifest" 
                passed={testResults.manifest} 
                description="Manifest dosyası erişilebilir ve link tag mevcut"
              />
              <TestResult 
                name="PWA Icons" 
                passed={testResults.icons} 
                description="Apple touch icons ve favicon'lar tanımlanmış"
              />
              <TestResult 
                name="Notifications" 
                passed={testResults.notifications} 
                description="Notification API tarayıcı tarafından destekleniyor"
              />
              <TestResult 
                name="Network Detection" 
                passed={testResults.network} 
                description="Network durumu algılanabiliyor"
              />
              <TestResult 
                name="Install Prompt" 
                passed={testResults.installPrompt} 
                description="PWA install prompt mekanizması mevcut"
              />
              <TestResult 
                name="Cache API" 
                passed={testResults.cacheAPI} 
                description="Cache API destekleniyor"
              />
              <TestResult 
                name="Background Sync" 
                passed={testResults.backgroundSync} 
                description="Background Sync API destekleniyor"
              />
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Test Summary</h3>
              <p className="text-sm text-gray-600">
                {Object.values(testResults).filter(Boolean).length} / {Object.keys(testResults).length} tests passed
              </p>
            </div>
          </div>
        )}

        {/* Manual Testing Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Manual Testing Instructions</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Chrome DevTools → Application tab → Service Workers (check registration)</li>
            <li>• Chrome DevTools → Application tab → Manifest (check manifest validity)</li>
            <li>• Chrome DevTools → Lighthouse → PWA audit (should score 90+)</li>
            <li>• Turn off network in DevTools → verify offline functionality</li>
            <li>• Chrome address bar → install button should appear</li>
            <li>• Mobile device → "Add to Home Screen" option should be available</li>
          </ul>
        </div>
      </div>
    </div>
  );
};