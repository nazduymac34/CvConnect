import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { CVConnectStore } from "../store/storage";

export default function Home() {
  const [stats, setStats] = useState({ candidates: 0, employers: 0, positions: 0 });

  useEffect(() => {
    const candidates = CVConnectStore.getCandidates();
    const employers = CVConnectStore.getEmployers();
    const positions = employers.reduce((sum, e) => sum + (e.positions?.length || 0), 0);
    setStats({
      candidates: candidates.length,
      employers: employers.length,
      positions,
    });
  }, []);

  return (
    <Layout
      bodyClass="homepage"
      footerText={<p className="project-title">CVConnect &bull; React &amp; Web Tasarımı</p>}
    >
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="tag">İşe alım süreçlerinde profesyonel çözüm</span>
              <h1>Doğru yetenekle doğru şirketi aynı platformda buluşturun</h1>
              <p className="lead">
                CVConnect, aday ve işveren verilerini tek merkezde yöneterek daha hızlı eşleşme,
                daha şeffaf iletişim ve daha güçlü bir işe alım deneyimi sunar.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/jobs">
                  Açık Pozisyonları Keşfet
                </Link>
                <Link className="btn btn-secondary" to="/candidate-search">
                  Mükemmel Adayı Bul
                </Link>
              </div>
              <div className="hero-trust">
                <span>Doğrudan mesajlaşma</span>
                <span>Filtrelenebilir aday havuzu</span>
                <span>Yerel veri güvenliği</span>
              </div>
            </div>
            <aside className="hero-card">
              <h3>Platform Özeti</h3>
              <div className="stats">
                <div className="stat">
                  <strong>{stats.candidates}</strong>
                  <span>Aday</span>
                </div>
                <div className="stat">
                  <strong>{stats.employers}</strong>
                  <span>İşveren</span>
                </div>
                <div className="stat">
                  <strong>{stats.positions}</strong>
                  <span>Pozisyon</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="grid-3">
              <article className="feature">
                <h3>Yetkinlik Odaklı Profil</h3>
                <p>Adaylar deneyimlerini, becerilerini ve portföy bilgilerini güçlü bir formatta sunar.</p>
              </article>
              <article className="feature">
                <h3>İşveren Kontrol Paneli</h3>
                <p>Şirket bilgileri, açık roller ve ekip ihtiyaçları tek akışta yönetilir.</p>
              </article>
              <article className="feature">
                <h3>Hızlı Eşleşme ve İletişim</h3>
                <p>Filtreleme ve mesajlaşma altyapısı sayesinde doğru adaylara hızla erişilir.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
