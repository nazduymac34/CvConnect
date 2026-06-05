import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { CVConnectStore } from "../store/storage";

export default function Inbox() {
  const [messages, setMessages] = useState([]);
  const [candidateMap, setCandidateMap] = useState(new Map());

  useEffect(() => {
    const candidates = CVConnectStore.getCandidates();
    setCandidateMap(new Map(candidates.map((c) => [c.id, c])));
    const sorted = CVConnectStore.getMessages().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setMessages(sorted);
  }, []);

  return (
    <Layout>
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">Mesaj Geçmişi</h1>
          <p className="lead">İşverenlerin adaylara gönderdiği mesajlar burada tutulur.</p>
        </section>
        <section id="inbox-results" className="result-grid">
          {messages.length === 0 ? (
            <div className="empty">Henüz gönderilmiş mesaj bulunmuyor.</div>
          ) : (
            messages.map((m) => {
              const target = candidateMap.get(m.toCandidateId);
              const targetText = target ? `${target.fullName} (${target.title})` : "Bilinmeyen çalışan";
              const date = new Date(m.createdAt).toLocaleString("tr-TR");
              return (
                <article key={m.id} className="card">
                  <h3>{m.subject}</h3>
                  <p className="meta">
                    Gönderen: {m.fromEmployer} ({m.fromEmail})
                  </p>
                  <p className="meta">Alıcı: {targetText}</p>
                  <p className="meta">Tarih: {date}</p>
                  <p>{m.message}</p>
                </article>
              );
            })
          )}
        </section>
      </main>
    </Layout>
  );
}
