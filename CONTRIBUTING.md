# 🤝 Katkıda Bulunma Rehberi

Lezzet Durağı projesine katkıda bulunduğunuz için teşekkürler! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 📋 İçindekiler

- [Kodlama Standartları](#kodlama-standartları)
- [Geliştirme Süreci](#geliştirme-süreci)
- [Commit Mesajları](#commit-mesajları)
- [Pull Request Süreci](#pull-request-süreci)
- [Test Etme](#test-etme)
- [Sorun Bildirme](#sorun-bildirme)

## 🛠️ Geliştirme Süreci

### 1. Repository'yi Fork Edin

```bash
# GitHub'da fork butonuna tıklayın
# Sonra local'inize klonlayın
git clone https://github.com/YOUR_USERNAME/lezzet-duragi.git
cd lezzet-duragi
```

### 2. Upstream Remote Ekleyin

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/lezzet-duragi.git
```

### 3. Development Branch Oluşturun

```bash
git checkout -b feature/your-feature-name
# veya
git checkout -b fix/your-bug-fix
```

### 4. Dependencies'leri Yükleyin

```bash
npm install
```

### 5. Development Server'ı Başlatın

```bash
npm run dev
```

## 📝 Kodlama Standartları

### TypeScript

- **Strict mode** kullanın
- **Interface'ler** için `I` prefix kullanmayın
- **Type annotations** ekleyin
- **Any type** kullanmaktan kaçının

```typescript
// ✅ İyi
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Kötü
interface IUser {
  id: any;
  name: any;
}
```

### React

- **Functional components** kullanın
- **Custom hooks** oluşturun
- **Props destructuring** yapın
- **useCallback** ve **useMemo** kullanın

```typescript
// ✅ İyi
const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const handleEdit = useCallback(() => {
    onEdit(user.id);
  }, [user.id, onEdit]);

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={handleEdit}>Düzenle</button>
    </div>
  );
};
```

### CSS/Styling

- **Tailwind CSS** kullanın
- **Responsive design** uygulayın
- **Dark mode** desteği ekleyin
- **CSS modules** kullanmayın

```tsx
// ✅ İyi
<div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Başlık
  </h2>
</div>
```

### Firebase

- **Error handling** ekleyin
- **Loading states** yönetin
- **Real-time listeners** temizleyin

```typescript
// ✅ İyi
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'orders'),
    (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(orders);
    },
    (error) => {
      console.error('Error fetching orders:', error);
      showToast('Siparişler yüklenirken hata oluştu', 'error');
    }
  );

  return () => unsubscribe();
}, []);
```

## 📝 Commit Mesajları

**Conventional Commits** formatını kullanın:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: Yeni özellik
- `fix`: Bug düzeltmesi
- `docs`: Dokümantasyon değişikliği
- `style`: Kod formatı (linter, prettier)
- `refactor`: Kod refactoring
- `test`: Test ekleme/düzeltme
- `chore`: Build, dependencies

### Örnekler

```bash
# ✅ İyi commit mesajları
feat(admin): add customer management dashboard
fix(payment): resolve Stripe payment validation error
docs(readme): update installation instructions
style(ui): improve button hover animations
refactor(auth): simplify login form validation
test(cart): add unit tests for cart context
chore(deps): update Firebase to v12.1.0

# ❌ Kötü commit mesajları
fix bug
update
changes
wip
```

## 🔄 Pull Request Süreci

### 1. Branch'inizi Güncelleyin

```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout your-feature-branch
git rebase main
```

### 2. Testleri Çalıştırın

```bash
npm run test
npm run lint
npm run build
```

### 3. Pull Request Oluşturun

- **Açıklayıcı başlık** yazın
- **Değişiklikleri detaylandırın**
- **Screenshots** ekleyin (UI değişiklikleri için)
- **Related issues** linkleyin

### PR Template

```markdown
## 📝 Açıklama
Bu PR ne yapıyor?

## 🔄 Değişiklik Türü
- [ ] Bug fix
- [ ] Yeni özellik
- [ ] Breaking change
- [ ] Dokümantasyon güncellemesi

## 🧪 Test Edildi
- [ ] Unit testler geçiyor
- [ ] Manual test yapıldı
- [ ] Responsive test yapıldı
- [ ] Browser compatibility test edildi

## 📱 Screenshots (varsa)
<!-- UI değişiklikleri için screenshot ekleyin -->

## 🔗 Related Issues
Closes #123
```

## 🧪 Test Etme

### Unit Tests

```bash
# Tüm testleri çalıştır
npm run test

# Coverage raporu
npm run test:coverage

# Watch mode
npm run test:watch
```

### Manual Testing

- [ ] **Authentication**: Login/Register/Logout
- [ ] **Menu**: Ürün listesi, filtreleme, arama
- [ ] **Cart**: Sepete ekleme/çıkarma, miktar değiştirme
- [ ] **Checkout**: Adres seçimi, ödeme
- [ ] **Admin Panel**: Tüm CRUD işlemleri
- [ ] **Responsive**: Mobile/Tablet/Desktop
- [ ] **PWA**: Offline çalışma, install prompt

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## 🐛 Sorun Bildirme

### Bug Report Template

```markdown
## 🐛 Bug Açıklaması
Açık ve kısa bir açıklama yazın.

## 🔄 Adımlar
1. '...' sayfasına gidin
2. '...' butonuna tıklayın
3. '...' hatası görünür

## 🎯 Beklenen Davranış
Ne olması gerekiyordu?

## 📱 Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

## 📸 Screenshots
Varsa ekleyin.

## 📋 Ek Bilgiler
Başka bir şey eklemek istiyorsanız.
```

## 💡 Özellik İstekleri

### Feature Request Template

```markdown
## 🚀 Özellik Açıklaması
Hangi özelliği istiyorsunuz?

## 💭 Motivasyon
Bu özellik neden gerekli?

## 📋 Detaylar
Nasıl çalışmasını istiyorsunuz?

## 🎨 Tasarım (varsa)
Mockup veya wireframe ekleyin.

## 🔗 Alternatifler
Başka çözümler düşündünüz mü?
```

## 📞 İletişim

- **GitHub Issues**: Sorunlar ve özellik istekleri için
- **Discussions**: Genel sorular için
- **Email**: your.email@example.com

## 🙏 Teşekkürler

Katkıda bulunan herkese teşekkürler! 🎉

---

**Not**: Bu rehberi takip ederek projeye değerli katkılar sağlayabilirsiniz. Sorularınız varsa çekinmeden sorun!
