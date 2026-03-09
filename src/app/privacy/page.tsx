export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#06090f] text-slate-300 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">Gizlilik Politikası</h1>
        <p className="text-sm text-slate-500 mb-8">Son güncelleme: 9 Mart 2025</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Toplanan Veriler</h2>
            <p>
              Meta Ads Command Center, Facebook OAuth ile giriş yaptığınızda aşağıdaki bilgileri toplar:
              adınız, email adresiniz ve profil fotoğrafınız. Ayrıca, izin verdiğiniz takdirde Meta
              reklam hesabı verilerinize (kampanyalar, reklamlar, istatistikler) erişim sağlanır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Verilerin Kullanımı</h2>
            <p>
              Toplanan veriler yalnızca reklam kampanyalarınızın analizi, raporlanması ve
              optimizasyonu amacıyla kullanılır. Verileriniz üçüncü taraflarla paylaşılmaz
              ve satılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Veri Güvenliği</h2>
            <p>
              Tüm veriler SSL/TLS şifrelemesi ile iletilir. Erişim token&apos;ları güvenli
              sunucularda saklanır ve düzenli olarak yenilenir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Veri Silme</h2>
            <p>
              Hesabınızı istediğiniz zaman silebilirsiniz. Hesap silindiğinde tüm verileriniz
              kalıcı olarak kaldırılır. Veri silme talebi için: social@mackatech.com
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Çerezler</h2>
            <p>
              Oturum yönetimi için gerekli çerezler kullanılır. Reklam veya izleme amaçlı
              üçüncü taraf çerezleri kullanılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. İletişim</h2>
            <p>
              Gizlilik politikası hakkında sorularınız için: social@mackatech.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
