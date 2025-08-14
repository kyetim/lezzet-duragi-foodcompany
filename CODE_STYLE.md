# Lezzet Durağı – Kodlama Standartları & Proje Yapısı

## 1. Genel Yaklaşım

- **Dil:** Tüm kod TypeScript ile yazılmalı.
- **Framework:** React.js, Shadcn UI, Radix UI, Tailwind CSS, Redux Toolkit.
- **Programlama Tarzı:** Fonksiyonel ve deklaratif. Sınıflardan kaçınılmalı.
- **Dosya Yapısı:** Her dosyada önce ana bileşen, ardından alt bileşenler, yardımcı fonksiyonlar, statik içerik ve tipler yer almalı.

---

## 2. Dosya ve Dizin Yapısı

- **Dizinler:** Küçük harf ve tire ile (`components/menu-category`).
- **Bileşenler:** Her bileşen kendi dosyasında, named export ile.
- **Yardımcılar:** `helpers/` dizininde saf fonksiyonlar.
- **Tipler:** `interfaces/` dizininde, sadece interface kullan.

---

## 3. Adlandırma Kuralları

- **Değişkenler:** Anlamlı, yardımcı fiil içeren isimler (`isLoading`, `hasError`).
- **Dizinler:** Küçük harf, tireli (`menu-list`).
- **Bileşenler:** Named export, PascalCase (`export function MenuList()`).

---

## 4. TypeScript Kullanımı

- **interface** kullan, **type** ve **enum**'dan kaçın.
- **Map** ile sabitler oluştur.
- **Fonksiyonel Bileşenler:** Her zaman fonksiyon bildirimi ile:
  ```tsx
  export function MenuList(props: MenuListProps) { ... }
  ```
- **Props ve State:** Her zaman interface ile tiplenmeli.

---

## 5. Söz Dizimi ve Biçimlendirme

- **Fonksiyonlar:** Saf fonksiyonlar için `function` anahtar kelimesi.
- **Kısa Koşullar:** Gereksiz süslü parantezlerden kaçın.
- **JSX:** Deklaratif ve okunabilir olmalı.

---

## 6. UI ve Stil

- **Bileşenler:** Shadcn UI ve Radix UI ile oluştur.
- **Stil:** Tailwind CSS, mobile-first yaklaşım.
- **Responsive:** Her bileşen mobilde düzgün çalışmalı.
- **Renk Paleti:** Kırmızı (#D62828), Sarı (#F77F00), Beyaz (#FFFFFF).
- **Yazı Tipleri:** Poppins (başlıklar), Open Sans (gövde).

---

## 7. Performans ve Optimizasyon

- **React Hooks:** Verimli kullanım, gereksiz re-render'lardan kaçın.
- **Lazy Loading:** Menü görselleri ve büyük bileşenler için.
- **Görseller:** WebP formatı, boyut bilgisi, lazy loading.
- **Web Vitals:** LCP, CLS, FID optimize edilmeli.

---

## 8. State ve URL Yönetimi

- **URL Parametreleri:** React Router ile yönet.
- **State:** Redux Toolkit ile global state yönetimi.
- **Local State:** useState ve useReducer ile component state'i.

---

## 9. React Standartları

- **Veri Çekme:** Axios veya fetch ile API çağrıları.
- **Yönlendirme:** React Router kullan.
- **Error Handling:** Try-catch blokları ve error boundary'ler.

---

## 10. Örnek Bileşen

```tsx
// components/menu-list/menu-list.tsx
import { Card } from "@/components/ui/card";
import { MenuItem } from "@/interfaces/menu-item";

export interface MenuListProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  category: string;
}

export function MenuList({ menuItems, isLoading, category }: MenuListProps) {
  if (isLoading) return <div>Menü yükleniyor...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map(item =>
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <img
            src={item.imageWebp}
            alt={item.name}
            width={400}
            height={300}
            loading="lazy"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-poppins font-semibold text-lg text-gray-800">{item.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{item.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-red-600">{item.price}₺</span>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Sepete Ekle
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
```

---

## 11. Proje Özellikleri

### Lezzet Durağı Web Sitesi – Yemek Restoranı Projesi

**1. Proje Kapsamı ve Hedef Kitle:**
- **Projenin Amacı:** Döner, makarna, salata ve içecek satışı yapan bir yemek restoranı için kullanıcı dostu web platformu.
- **Hedef Kitle:** Hızlı, lezzetli ve uygun fiyatlı yemek arayan gençler, çalışanlar ve öğrenciler.

**2. Temel Özellikler:**
- **Ana Sayfa:** Kampanyalar, öne çıkan ürünler, samimi ve iştah açıcı içerikler
- **Menü Sayfaları:** Döner, makarna, salata, içecek kategorileri
- **Sipariş Sistemi:** Dükkanda teslim ve online teslimat seçenekleri
- **Ödeme Entegrasyonu:** Stripe veya Iyzico ile güvenli ödeme
- **Kullanıcı Yönetimi:** Kayıt, giriş, sipariş geçmişi
- **Admin Paneli:** Ürün, kullanıcı, sipariş ve kampanya yönetimi

**3. Tasarım Yönergeleri:**
- **Marka Kimliği:** Lezzet Durağı markası ile uyumlu
- **Renk Paleti:** Kırmızı (#D62828), Sarı (#F77F00), Beyaz (#FFFFFF)
- **Yazı Tipleri:** Poppins (başlıklar), Open Sans (gövde)
- **Görsel Stil:** Sıcak renkler, sade arka planlar, gerçek ürün görselleri

**4. Teknik Altyapı:**
- **Frontend:** React.js, TypeScript, Tailwind CSS
- **Backend:** Node.js + Express
- **Veritabanı:** MongoDB
- **Hosting:** Frontend (Vercel), Backend (Render.com)
- **API:** RESTful API ile iletişim

**5. Terminal Komutları:**
- Terminal'de && kullanmadan, komutları tek tek yazın
- Her adımı ayrı ayrı çalıştırın

Bu standartlar, Lezzet Durağı yemek restoranı web sitesinin tutarlı, performanslı ve kullanıcı dostu bir şekilde geliştirilmesini sağlar.