import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import CandidateCard from "../components/CandidateCard";
import FormFeedback from "../components/FormFeedback";
import { CVConnectStore } from "../store/storage";

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState([]);
  const [targetCandidateId, setTargetCandidateId] = useState("");
  const [msgFeedback, setMsgFeedback] = useState("");
  const messageFormRef = useRef(null);

  const applyFilters = (form) => {
    const data = new FormData(form);
    const city = String(data.get("city") || "").toLowerCase().trim();
    const skill = String(data.get("skill") || "").toLowerCase().trim();
    const minExp = Number(data.get("minExp") || 0);

    const items = CVConnectStore.getCandidates().filter((c) => {
      const passCity = !city || c.city.toLowerCase().includes(city);
      const passSkill = !skill || (c.skills || []).some((s) => s.toLowerCase().includes(skill));
      const passExp = Number(c.experience) >= minExp;
      return passCity && passSkill && passExp;
    });
    setCandidates(items);
  };

  useEffect(() => {
    const city = "";
    const skill = "";
    const minExp = 0;
    const items = CVConnectStore.getCandidates().filter((c) => {
      const passCity = !city || c.city.toLowerCase().includes(city);
      const passSkill = !skill || (c.skills || []).some((s) => s.toLowerCase().includes(skill));
      const passExp = Number(c.experience) >= minExp;
      return passCity && passSkill && passExp;
    });
    setCandidates(items);
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    applyFilters(e.target);
  };

  const handleMessage = (e) => {
    e.preventDefault();
    if (!targetCandidateId) {
      setMsgFeedback("Önce kartlardan bir çalışan seçin.");
      return;
    }
    const data = new FormData(e.target);
    CVConnectStore.addMessage({
      toCandidateId: targetCandidateId,
      fromEmployer: String(data.get("company") || "").trim(),
      fromEmail: String(data.get("email") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
    });
    e.target.reset();
    setMsgFeedback("Mesaj gönderildi ve kaydedildi.");
  };

  const selectCandidate = (id) => {
    setTargetCandidateId(id);
    messageFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Layout>
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">Aday Filtreleme ve İletişim</h1>
          <p className="lead">İşverenler şehir, yetenek ve deneyime göre adayları filtreleyebilir.</p>
        </section>
        <section className="card">
          <form id="filter-form" onSubmit={handleFilter}>
            <div className="form-grid">
              <label>
                Şehir
                <input name="city" placeholder="Istanbul" />
              </label>
              <label>
                Yetenek
                <input name="skill" placeholder="React" />
              </label>
              <label>
                Minimum Deneyim (yıl)
                <input type="number" min="0" name="minExp" defaultValue="0" />
              </label>
            </div>
            <button className="btn btn-primary" type="submit">
              Filtreyi Uygula
            </button>
          </form>
        </section>
        <section id="candidate-results" className="result-grid">
          {candidates.length === 0 ? (
            <div className="empty">Filtreye uyan çalışan bulunamadı.</div>
          ) : (
            candidates.map((c) => (
              <CandidateCard key={c.id} candidate={c} onMessage={selectCandidate} />
            ))
          )}
        </section>
        <section className="card section" ref={messageFormRef}>
          <h2>Adaya Mesaj Gönder</h2>
          <p className="hint">Önce bir aday kartında &quot;Mesaj Gönder&quot; butonuna tıklayın.</p>
          <form id="message-form" onSubmit={handleMessage}>
            <div className="form-grid">
              <label>
                Şirket Adı
                <input name="company" required />
              </label>
              <label>
                Şirket E-postası
                <input type="email" name="email" required />
              </label>
              <label>
                Konu
                <input name="subject" required />
              </label>
            </div>
            <label>
              Mesaj
              <textarea name="message" required />
            </label>
            <button className="btn btn-secondary" type="submit">
              Mesajı Kaydet ve Gönder
            </button>
            <FormFeedback message={msgFeedback} />
          </form>
        </section>
      </main>
    </Layout>
  );
}
