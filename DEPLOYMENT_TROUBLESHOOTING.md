# Vercel Deployment Sorun Giderme Rehberi

## Mevcut Sorun
"Siparişi tamamla sayfasında ödemeyi yapmaya çalıştığımda işlem yapmadan menü sayfasına geri yönlendiriyor"

## Olası Nedenler ve Çözümler

### 1. Environment Variables Eksik

**Kontrol Edilecekler:**
- Vercel Dashboard > Settings > Environment Variables 
- `STRIPE_SECRET_KEY` (server-side API için)
- `VITE_STRIPE_PUBLISHABLE_KEY` (client-side için)

**Çözüm:**
```bash
# Vercel CLI ile kontrol
vercel env ls

# Environment variables eklemek için
vercel env add STRIPE_SECRET_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
```

### 2. Stripe Test vs Production Keys

**Test Environment için:**
- `STRIPE_SECRET_KEY`: `sk_test_...`
- `VITE_STRIPE_PUBLISHABLE_KEY`: `pk_test_...`

**Production Environment için:**
- `STRIPE_SECRET_KEY`: `sk_live_...`
- `VITE_STRIPE_PUBLISHABLE_KEY`: `pk_live_...`

### 3. API Endpoint Problemi

**Kontrol:**
- `/api/create-payment-intent` endpoint'inin çalışıp çalışmadığı
- Vercel Function logs'u incelemek

**Test etmek için:**
```bash
curl -X POST https://your-vercel-domain.com/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "try"}'
```

### 4. Browser Debug İçin

**1. Developer Console'u açın (F12)**
**2. Network tab'ında şunları kontrol edin:**
- `/api/create-payment-intent` çağrısı yapılıyor mu?
- Response status kodu nedir?
- Error mesajları var mı?

**3. Console tab'ında şunları arayın:**
- Stripe konfigürasyon mesajları
- Payment process debug mesajları
- Error mesajları

### 5. Authentication Problemi

**Kontrol:**
- Firebase authentication çalışıyor mu?
- User session kaybolmuş olabilir
- ProtectedRoute redirect yapıyor olabilir

### 6. Cart State Problemi

**Kontrol:**
- LocalStorage'da cart verisi var mı?
- Cart items sayısı 0 mı?
- CheckoutPage useEffect'i cart boş olduğu için redirect ediyor olabilir

## Debug Mesajları Eklendi

Projeye debug mesajları eklendi. Browser console'da şu mesajları arayın:

- `🔍 CheckoutPage useEffect: Checking auth and cart state`
- `🟢 Payment process starting for amount:`
- `🟢 Creating payment intent...`
- `🟢 Payment intent created:`
- `🟢 Confirming payment...`
- `🔴 Payment error:` (hata durumunda)

## Immediate Fix Önerileri

1. **Environment Variables'ları Kontrol Et**
2. **Browser Console'u İncele**
3. **Network Tab'ını İncele**
4. **Vercel Function Logs'unu Kontrol Et**

## Vercel Function Logs'u Kontrol Etme

```bash
# Vercel CLI ile logs görme
vercel logs --function=api/create-payment-intent

# Veya Vercel Dashboard > Functions sekmesi
```

## Test Kartları (Stripe Test Mode)

- **Başarılı**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

## Acil Çözüm İçin

Eğer hiçbir şey çalışmıyorsa, geçici olarak sadece nakit ödeme seçeneğini aktif bırakabilirsiniz:

1. CheckoutPage'de payment method default'unu 'cash' yapın
2. Card payment seçeneğini geçici olarak disable edin