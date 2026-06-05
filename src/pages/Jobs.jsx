import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { CVConnectStore } from "../store/storage";

export default function Jobs() {
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    setEmployers(CVConnectStore.getEmployers());
  }, []);

  return (
    <Layout>
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">İşverenler ve Açık Pozisyonlar</h1>
          <p className="lead">Kayıtlı şirketleri ve oluşturdukları ilanları tek ekranda görüntüleyin.</p>
        </section>
        <section id="job-results" className="result-grid">
          {employers.length === 0 ? (
            <div className="empty">Henüz kayıtlı işveren yok.</div>
          ) : (
            employers.map((e) => (
              <article key={e.id} className="card">
                <h3>{e.company}</h3>
                <p className="meta">
                  {e.sector} • {e.location}
                </p>
                <p>{e.about}</p>
                <p className="meta">
                  İletişim: {e.contactName} ({e.email})
                </p>
                <div className="result-grid">
                  {(e.positions || []).map((p, idx) => (
                    <div key={idx} className="card" style={{ boxShadow: "none" }}>
                      <h4>{p.title}</h4>
                      <p className="meta">
                        {p.level} • {p.type}
                      </p>
                      <p>{p.description}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </Layout>
  );
}
