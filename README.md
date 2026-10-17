# M HANS GROUP — Finans Yönetimi

Ahmet Bulut için hazırlanan, M HANS GROUP kimliğiyle çalışan bağımsız finans yönetim uygulaması. Türkçe ve mobil uyumlu arayüzüyle gelirleri, giderleri, banka ve cari hesapları, yaklaşan ödemeleri ve tahsilatları tek yerde takip eder. React 19, TypeScript ve Vite ile geliştirilmiştir.

Projenin kaynak kodları size ait GitHub deposundadır: [ahmetbltnn-web/komagene-yeni-](https://github.com/ahmetbltnn-web/komagene-yeni-).

## Kurulum ve çalıştırma

Node.js 20.19+ veya 22+ ve npm gerekir. GitHub'dan ZIP dosyasını indirin, çıkartın ve `package.json` dosyasının bulunduğu proje klasöründe terminal açın:

```bash
npm ci
npm run dev
```

Terminalde gösterilen yerel adresi tarayıcınızda açın. Üretim dosyalarını oluşturmak ve yerel olarak incelemek için:

```bash
npm run build
npm run preview
```

`npm run build`, TypeScript kontrolünü ve üretim derlemesini birlikte çalıştırır. Oluşan `dist` klasörü bir statik web sunucusunda yayımlanabilir.

## İlk kullanım

Yeni kurulum boş başlar; kurgusal finansal kayıt eklenmez. İlk banka hesabınızı oluşturup gelir, gider, cari hesap ve planlı işlemlerinizi ekleyebilirsiniz. Kayıtlar tamamen boşken Ayarlar bölümünden isteğe bağlı örnek veriler yüklenebilir.

Ayarlar bölümünde uygulama adını, firma adını ve kullanıcı adını değiştirebilirsiniz. Varsayılan kimlik M HANS GROUP ve Ahmet Bulut'tur. Aynı tarayıcıdaki önceki uygulama kayıtları varsa korunarak taşınır.

## Özellikler

- Gelir, gider, toplam bakiye ve kâr özeti; önceki ayla karşılaştırmalar.
- İşlemlerden hesaplanan haftalık, aylık ve yıllık nakit akışı grafikleri; kategori bazında gider dağılımı.
- Gelir ve gider ekleme, ayrıntı görüntüleme, silme, arama ve filtreleme.
- Banka hesapları ve işlemlere göre güncellenen bakiyeler.
- Müşteri ve tedarikçi cari hesapları, alacak ve borç takibi.
- Planlı ödemeler ve tahsilatlar; tamamlandığında ilgili banka ve cari hesap bakiyelerinin güncellenmesi.
- Muhasebeleşen planlı işlem silindiğinde bakiyelerin ve plan durumunun geri alınması.
- Excel uyumlu UTF-8 CSV raporları.
- Tüm finans kayıtları ve kişisel ayarlar için JSON yedekleme ve geri yükleme.
- Mobil menü, klavye ile kullanım ve odak yönetimli pencereler.

## Veriler ve yedekleme

Kayıtlar `mhans-finans-` önekiyle kullandığınız tarayıcının `localStorage` alanında tutulur ve sayfa yenilendiğinde korunur. Tarayıcı verilerinin temizlenmesi yerel kayıtları siler. Düzenli olarak Ayarlar bölümündeki JSON yedekleme seçeneğini kullanın.

JSON yedeği banka hesaplarını, gelir ve gider işlemlerini, cari hesapları, planlı ödeme ve tahsilatları, firma adını ve kullanıcı profilini içerir. Geri yükleme sırasında dosyanın biçimi ve kayıtları doğrulanır; kayıt sayıları önizlemede gösterilir. Onayladığınızda yedek mevcut verilerin yerini alır. Mevcut verileriniz varsa değiştirilmeden önce ayrı bir JSON yedeği olarak indirilir. Yedeği başka bir tarayıcıda geri yükleyerek kayıtlarınızı taşıyabilirsiniz.

Örnek kayıtlarla denemeyi bitirdiğinizde **Ayarlar → Temiz başlangıç → Kayıtları sıfırla** yolunu kullanın. Silinecek kayıt sayıları gösterilir; kutuyu işaretleyip **Yedekle ve sıfırla** düğmesine basınca önce JSON yedeği indirilir, ardından tüm finansal kayıtlar temizlenir. Bu işlem eklediğiniz gerçek finansal kayıtları da kapsar. Firma, uygulama ve kullanıcı adları korunur. Depolamaya yazılamazsa sıfırlama uygulanmaz. Gerekirse indirdiğiniz yedeği aynı Ayarlar bölümünden geri yükleyebilirsiniz.

## Bağımsız kullanım ve kapsam

Uygulamayı çalıştırmak için sağlayıcı hesabı, abonelik, gizli anahtar veya uzak API gerekmez. İlk bağımlılık kurulumu internet bağlantısı gerektirir; ikonlar ve yazı tipleri uygulamayla birlikte sunulur.

Bu sürüm tarayıcıda çalışan bir ön yüz uygulamasıdır. Banka hesapları manuel takip edilir. Sunucu uygulaması, sunucu veritabanı, kullanıcı doğrulaması, çok kullanıcılı çalışma, otomatik banka entegrasyonu ve cihazlar arası otomatik senkronizasyon uygulanmamıştır. Her tarayıcının verileri kendisine aittir; veri taşıma JSON yedeğiyle yapılır.
