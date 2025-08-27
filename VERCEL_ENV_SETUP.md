# Vercel Environment Variables Konfigürasyonu

Bu dosya, projenin Vercel'de düzgün çalışması için gerekli environment variables'ları açıklar.

## ✅ Runtime Hatası Düzeltildi

`vercel.json` dosyası güncellenip runtime hatası düzeltildi. Vercel artık otomatik olarak Node.js runtime'ı detect edecek.

## Gerekli Environment Variables

### Production & Preview Environment'ları için:

1. **STRIPE_SECRET_KEY** (Server-side)
   - Stripe Dashboard'dan alınan secret key
   - `sk_live_...` (production) veya `sk_test_...` (test) ile başlar
   - Vercel Dashboard > Settings > Environment Variables'da ayarlanmalı
   - Değer: `sk_test_xyz...` veya `sk_live_xyz...`

2. **VITE_STRIPE_PUBLISHABLE_KEY** (Client-side)
   - Stripe Dashboard'dan alınan publishable key
   - `pk_live_...` (production) veya `pk_test_...` (test) ile başlar
   - Vercel Dashboard > Settings > Environment Variables'da ayarlanmalı
   - Değer: `pk_test_xyz...` veya `pk_live_xyz...`

## Vercel Dashboard'da Environment Variables Nasıl Ayarlanır:

1. Vercel projenize gidin
2. Settings > Environment Variables sekmesine tıklayın
3. "Add New" butonuna tıklayın
4. Name: `STRIPE_SECRET_KEY`, Value: `sk_test_...` girin
5. Environment: Production, Preview, Development seçin
6. "Save" butonuna tıklayın
7. Aynı işlemi `VITE_STRIPE_PUBLISHABLE_KEY` için tekrarlayın

## Test Etme:

Vercel deployment'ı test etmek için:
1. Environment variables'ları ayarladıktan sonra yeni bir deployment yapın
2. Browser console'da Stripe konfigürasyonunu kontrol edin
3. Checkout sayfasında ödeme yapmayı deneyin
4. Network tab'ında `/api/create-payment-intent` endpoint'inin çalıştığını kontrol edin

## Stripe Test Cards:

Test environment'ı için kullanılabilecek kartlar:
- Başarılı: 4242 4242 4242 4242
- Declined: 4000 0000 0000 0002
- Insufficient funds: 4000 0000 0000 9995

## Sorun Giderme:

### "Payment system not configured" hatası:
- STRIPE_SECRET_KEY environment variable'ının ayarlandığını kontrol edin
- Vercel dashboard'da variable'ın doğru environment'lara (production, preview) atandığını kontrol edin

### "Stripe failed to load" hatası:
- VITE_STRIPE_PUBLISHABLE_KEY environment variable'ının ayarlandığını kontrol edin
- Browser console'da stripe konfigürasyonunu kontrol edin

### API 500 Error:
- Vercel function logs'unu kontrol edin
- STRIPE_SECRET_KEY'in doğru formatta olduğunu kontrol edin