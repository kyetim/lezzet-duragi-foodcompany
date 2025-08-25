# Kullanıcı Dil Tercihleri / User Language Preferences

## Türkçe Geri Bildirim Direktifi

Bu dosya, projedeki dil tercihlerini ve kullanıcı geri bildirim direktiflerini tanımlar.

### Genel Kural
Tüm sohbet konuşmalarında ve kullanıcı geri bildirimlerinde **Türkçe** dil kullanılmalıdır.

### Türkçe Kullanılması Gereken Alanlar

#### 1. Kullanıcı Arayüzü Mesajları
- ✅ Toast bildirimleri (başarı, hata, uyarı, bilgi)
- ✅ Doğrulama mesajları
- ✅ Form hata mesajları
- ✅ Yükleme durumu mesajları
- ✅ Onay mesajları

#### 2. Ödeme Sistemi
- ✅ Ödeme başarı/hata mesajları
- ✅ Ödeme durumu bildirimleri
- ✅ Kart doğrulama mesajları
- ✅ İşlem onay mesajları

#### 3. Sistem Geri Bildirimleri
- ✅ Sohbet konuşma yanıtları
- ✅ Kullanıcının görebileceği konsol mesajları
- ✅ Durum güncellemeleri
- ✅ İlerleme mesajları

#### 4. Hata Yönetimi
- ✅ Hata mesajları
- ✅ Hata açıklamaları
- ✅ Çözüm önerileri
- ✅ Yardım mesajları

### Örnekler

#### ✅ Doğru Kullanım
```typescript
toast.success('Ödeme Başarılı!', 'Siparişiniz başarıyla oluşturuldu!');
toast.error('Ödeme Hatası', 'Lütfen kart bilgilerinizi kontrol edin.');
console.log('✅ Ödeme başarıyla tamamlandı');
```

#### ❌ Yanlış Kullanım
```typescript
toast.success('Payment Successful!', 'Your order has been created!');
toast.error('Payment Error', 'Please check your card details.');
console.log('✅ Payment completed successfully');
```

### Teknik Uygulama

#### Toast Mesajları
```typescript
// Başarı mesajları
toast.success('Başarılı', 'İşlem başarıyla tamamlandı');

// Hata mesajları  
toast.error('Hata', 'Bir sorun oluştu, lütfen tekrar deneyin');

// Uyarı mesajları
toast.warning('Uyarı', 'Lütfen tüm alanları doldurun');

// Bilgi mesajları
toast.info('Bilgi', 'İşlem devam ediyor...');
```

#### Konsol Mesajları
```typescript
console.log('🔄 Ödeme işlemi başlatılıyor...');
console.log('✅ Ödeme başarıyla tamamlandı');
console.log('❌ Ödeme işlemi başarısız');
```

### Süreklilik Kuralları

1. **Tüm yeni özellikler** Türkçe mesajlar içermelidir
2. **Mevcut İngilizce mesajlar** zaman içinde Türkçeye çevrilmelidir
3. **Kod yorumları** İngilizce kalabilir (geliştirici odaklı)
4. **Değişken isimleri** İngilizce kalabilir (teknik standart)

### Notlar

- Bu direktif sadece **kullanıcı görünür** mesajlar içindir
- Teknik dokümantasyon ve kod yorumları İngilizce kalabilir
- API yanıtları ve backend mesajları mevcut durumlarını koruyabilir
- Hata ayıklama mesajları (development) İngilizce olabilir

---

**Son Güncelleme:** 2025-01-25  
**Durum:** Aktif  
**Kapsam:** Tüm kullanıcı arayüzü ve sohbet geri bildirimleri