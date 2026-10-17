# Finova

Türkçe, mobil uyumlu bir finans yönetim uygulaması. React 19, TypeScript ve Vite ile geliştirilmiştir.

## Çalıştırma

Node.js 20.19+ veya 22+ ve npm gerekir. Bu ortamda Node.js 24 ile doğrulanmıştır.

```bash
cd /workspace/komagene-yeni-
npm ci
npm run dev -- --port 5173
```

Üretim derlemesi ve yerel üretim sunucusu:

```bash
npm run build
npm run preview -- --port 4173
```

## Özellikler

- Gelir, gider, toplam bakiye ve kâr özeti; önceki ayla hesaplanan karşılaştırmalar.
- İşlemlerden üretilen haftalık, aylık ve yıllık kümülatif nakit akışı grafiği.
- Giderlerin kategori bazında dağılımı.
- Gelir/gider ekleme, ayrıntı görüntüleme, silme, arama ve filtreleme.
- Banka hesapları ve işlem kaydına göre güncellenen bakiyeler.
- Müşteri ve tedarikçi cari hesapları, alacak ve borç bakiyeleri.
- Planlı ödemeler ve tahsilatlar; tamamlama sırasında banka ve ilgili cari hesap güncellemesi.
- Bir planlı işlemin muhasebeleşen kaydı silindiğinde bakiye ve plan durumunun geri alınması.
- Excel uyumlu UTF-8 CSV raporları.
- Klavye ile kullanım, odak yönetimli pencereler ve mobil menü.

## Veri ve kapsam

Uygulama Ekim 2026 tarihli kurgusal örnek kayıtlarla açılır. Kayıtlar `finova-` önekiyle tarayıcının `localStorage` alanında saklanır; sayfa yenilendiğinde korunur. Tarayıcı verilerinin temizlenmesi kayıtları siler. Ayarlar sayfasından çalışma alanı adı değiştirilebilir.

Bu sürüm ön yüz uygulamasıdır. Banka hesapları manuel takip edilir; canlı banka bağlantısı, sunucu veritabanı, kullanıcı doğrulaması ve cihazlar arası senkronizasyon bulunmaz. Gizli anahtar veya ek servis gerekmez. İkonlar ve yazı tipleri uygulamayla birlikte sunulur; harici font servisi kullanılmaz.

## Doğrulama

`npm run build`, TypeScript kontrolünü ve üretim derlemesini çalıştırır. Ana kullanıcı akışları ayrıca Chromium/Playwright ile masaüstü ve mobil boyutlarda kontrol edilmiştir.
