# Terminal Portfolio - alialaca.dev

Terminal temalı, interaktif portfolyo web uygulaması.

## Teknolojiler

- **Framework:** Nuxt 3 (Vue 3)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **State:** Pinia
- **Markdown:** markdown-it

## Proje Yapısı

```
portfolio/
├── pages/
│   └── index.vue                 # Ana sayfa
├── components/
│   ├── TerminalApp.vue           # Ana terminal bileşeni
│   ├── Terminal/
│   │   ├── TerminalInput.vue     # Komut girişi + klavye olayları
│   │   ├── TerminalOutput.vue    # Komut geçmişi çıktısı
│   │   └── TerminalPrompt.vue    # user@host:path$ prompt
│   └── Viewer/
│       ├── FileViewer.vue        # Tam ekran dosya görüntüleyici
│       └── MarkdownRenderer.vue  # Markdown render
├── composables/
│   ├── useCommands.ts            # Komut tanımları ve işleyicisi
│   └── useTabCompletion.ts       # Tab completion mantığı
├── stores/
│   ├── auth.ts                   # Authentication state
│   ├── fileSystem.ts             # Sanal dosya sistemi
│   └── terminal.ts               # Terminal geçmişi ve viewer state
├── server/
│   ├── api/
│   │   └── auth/                 # Auth API (henüz boş)
│   └── utils/                    # Server utilities (henüz boş)
├── data/
│   └── filesystem.json           # Sanal dosya yapısı (portfolyo içeriği)
├── types/
│   └── index.ts                  # TypeScript type definitions
└── assets/css/
    └── terminal.css              # Terminal teması ve stiller
```

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Production build
```

## Docker

```bash
docker compose up --build
```

## Mevcut Komutlar

| Komut | Açıklama |
|-------|----------|
| `help` | Kullanılabilir komutları listeler |
| `pwd` | Mevcut dizini gösterir |
| `ls [-la]` | Dizin içeriğini listeler |
| `cd <path>` | Dizin değiştirir (~ destekler) |
| `cat <file>` | Dosya içeriğini görüntüler (tam ekran) |
| `tree` | Dizin yapısını ağaç olarak gösterir |
| `clear` | Terminali temizler |
| `whoami` | Mevcut kullanıcıyı gösterir |
| `login` | Sisteme giriş yapar |
| `logout` | Sistemden çıkış yapar |

## Klavye Kısayolları

- `↑/↓` - Komut geçmişinde gezinme
- `Tab` - Otomatik tamamlama
- `Ctrl+L` - Ekranı temizle
- `Ctrl+C` - Komutu iptal et
- `Ctrl+U` - Satırı temizle
- `ESC/q` - File viewer'dan çık

---

## Sonraki Geliştirmeler

### Faz 2: Gelişmiş Özellikler

- [ ] **Syntax highlighting:** Shiki ile kod bloklarını renklendir *(Shiki paketi yüklü, entegrasyon bekliyor)*
- [ ] **Tema seçimi:** Birden fazla terminal teması (dracula, monokai, vb.)
- [ ] **Responsive:** Mobil cihazlar için optimize et
- [ ] **Animasyonlar:** Yazı efekti, smooth scroll *(Mevcut: fadeIn input hint, cursor blink)*
- [ ] **Sound effects:** Tuş sesleri (opsiyonel)

### Faz 3: Auth & CRUD Komutları

Authenticated kullanıcılar için dosya sistemi düzenleme:

- [ ] `mkdir <name>` - Klasör oluştur
- [ ] `touch <name>` - Dosya oluştur
- [ ] `rm <name>` - Sil
- [ ] `cp <src> <dst>` - Kopyala
- [ ] `mv <src> <dst>` - Taşı/Yeniden adlandır
- [ ] `edit <file>` - Dosya düzenle (vim-like editor)

**Gerekli değişiklikler:**
- `composables/useCommands.ts` - Yeni komutları ekle
- `stores/fileSystem.ts` - CRUD metodları ekle
- Auth kontrolü: `auth.isAuthenticated` kontrol et

### Faz 4: Backend Entegrasyonu

*Not: Server klasör yapısı hazır (`server/api/auth/`, `server/utils/`)*

- [ ] **Server API routes:**
  - `server/api/filesystem.get.ts` - Dosya sistemi okuma
  - `server/api/filesystem.post.ts` - Dosya sistemi yazma
  - `server/api/auth/login.post.ts` - JWT authentication
  - `server/api/auth/logout.post.ts` - Logout

- [ ] **Veritabanı:** SQLite veya PostgreSQL
  - Dosya sistemi persistence
  - Kullanıcı yönetimi

- [ ] **FileSystem store güncelle:**
  - API'den veri çek
  - Değişiklikleri API'ye gönder

### Faz 5: Ekstra Özellikler

- [ ] `echo` komutu
- [ ] `grep` komutu (dosya içi arama)
- [ ] `find` komutu (dosya adı arama)
- [ ] `history` komutu (komut geçmişi)
- [ ] Pipe desteği (`ls | grep txt`)
- [ ] Alias desteği
- [ ] `.bashrc` benzeri config dosyası

### İçerik Güncellemeleri

`data/filesystem.json` dosyasını düzenleyerek:
- Yeni projeler ekle
- Blog yazıları ekle
- Sertifikalar güncelle
- İletişim bilgileri güncelle

---

## Notlar

### Component İsimlendirme

Nuxt auto-import sistemi klasör/dosya adlarını birleştirir:
- `components/Terminal/Input.vue` → `<TerminalInput />`
- `components/Viewer/FileViewer.vue` → `<ViewerFileViewer />`

### Dosya Sistemi JSON Yapısı

```typescript
interface FileNode {
  name: string
  type: 'file' | 'directory'
  content?: string        // Sadece dosyalar için
  children?: FileNode[]   // Sadece klasörler için
}
```

### Yeni Komut Ekleme

`composables/useCommands.ts` dosyasında:

1. `COMMANDS` array'ine komut tanımı ekle
2. `executeCommand` switch'ine case ekle
3. `cmdYeniKomut` fonksiyonu yaz

```typescript
function cmdYeniKomut(args: string[]): CommandResult {
  return {
    output: [text('Çıktı metni')],
  }
}
```
