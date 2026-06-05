import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import { CVConnectStore } from "../store/storage";

function AdminViewModal({ title, onClose, children }) {
  return (
    <div className="admin-modal-overlay" id="view-modal">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="admin-modal-content">{children}</div>
      </div>
    </div>
  );
}

export default function Admin() {
  const user = CVConnectStore.getCurrentUser();
  const [stats, setStats] = useState({ candidates: 0, employers: 0, jobs: 0 });
  const [candidateSearch, setCandidateSearch] = useState("");
  const [employerSearch, setEmployerSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [viewModal, setViewModal] = useState(null);

  const renderDashboard = (cSearch = candidateSearch, eSearch = employerSearch) => {
    const allCandidates = CVConnectStore.getCandidates();
    const allEmployers = CVConnectStore.getEmployers();
    let totalJobs = 0;
    allEmployers.forEach((e) => {
      totalJobs += (e.positions || []).length;
    });
    setStats({
      candidates: allCandidates.length,
      employers: allEmployers.length,
      jobs: totalJobs,
    });
    setCandidates(
      allCandidates.filter(
        (c) =>
          c.fullName.toLowerCase().includes(cSearch.toLowerCase()) ||
          c.email.toLowerCase().includes(cSearch.toLowerCase())
      )
    );
    setEmployers(
      allEmployers.filter(
        (e) =>
          e.company.toLowerCase().includes(eSearch.toLowerCase()) ||
          e.email.toLowerCase().includes(eSearch.toLowerCase())
      )
    );
  };

  useEffect(() => {
    renderDashboard();
  }, []);

  if (!user || user.userType !== "admin") {
    alert("Bu sayfayı görüntüleme yetkiniz yok.");
    return <Navigate to="/" replace />;
  }

  const deleteCandidate = (id) => {
    if (confirm("Bu adayı kalıcı olarak silmek istediğinize emin misiniz?")) {
      CVConnectStore.deleteCandidate(id);
      renderDashboard();
    }
  };

  const deleteEmployer = (id) => {
    if (confirm("Bu işvereni ve ona ait tüm iş ilanlarını silmek istediğinize emin misiniz?")) {
      CVConnectStore.deleteEmployer(id);
      renderDashboard();
    }
  };

  const viewCandidate = (id) => {
    const c = CVConnectStore.getCandidates().find((x) => x.id === id);
    if (!c) return;
    setViewModal({
      title: "Aday Profili",
      content: (
        <>
          <p>
            <strong>Ad Soyad:</strong> {c.fullName}
          </p>
          <p>
            <strong>Hedef Pozisyon:</strong> {c.title}
          </p>
          <p>
            <strong>Şehir:</strong> {c.city}
          </p>
          <p>
            <strong>Deneyim:</strong> {c.experience} Yıl
          </p>
          <p>
            <strong>Yetenekler:</strong> {(c.skills || []).join(", ")}
          </p>
          <p>
            <strong>Biyografi:</strong> {c.bio}
          </p>
        </>
      ),
    });
  };

  const viewEmployer = (id) => {
    const e = CVConnectStore.getEmployers().find((x) => x.id === id);
    if (!e) return;
    setViewModal({
      title: "İşveren Profili",
      content: (
        <>
          <p>
            <strong>Şirket Adı:</strong> {e.company}
          </p>
          <p>
            <strong>Sektör:</strong> {e.sector}
          </p>
          <p>
            <strong>Şehir:</strong> {e.location}
          </p>
          <p>
            <strong>İletişim Yetkilisi:</strong> {e.contactName} ({e.phone})
          </p>
          <p>
            <strong>Hakkında:</strong> {e.about}
          </p>
          <p>
            <strong>Açık İlanlar:</strong>
          </p>
          <ul>
            {(e.positions || []).length === 0 ? (
              <li>İlan yok</li>
            ) : (
              (e.positions || []).map((p, i) => (
                <li key={i}>
                  {p.title} ({p.type} - {p.level})
                </li>
              ))
            )}
          </ul>
        </>
      ),
    });
  };

  return (
    <Layout brandLabel="CVConnect Admin" footerText="CVConnect • Admin Paneli">
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">Yönetim Paneli</h1>
          <p className="lead">Sistemdeki tüm üyeleri ve verileri buradan yönetebilirsiniz.</p>
        </section>
        <section className="admin-stats stats">
          <div className="stat">
            <strong>{stats.candidates}</strong>
            <span>Toplam İş Arayan (Aday)</span>
          </div>
          <div className="stat">
            <strong>{stats.employers}</strong>
            <span>Toplam İşveren (Şirket)</span>
          </div>
          <div className="stat">
            <strong>{stats.jobs}</strong>
            <span>Açık İş Pozisyonu</span>
          </div>
        </section>
        <h2 className="section-title">Kayıtlı Adaylar</h2>
        <input
          type="text"
          id="search-candidates"
          className="admin-search-box"
          placeholder="Aday adına veya e-postasına göre ara..."
          value={candidateSearch}
          onChange={(e) => {
            setCandidateSearch(e.target.value);
            renderDashboard(e.target.value, employerSearch);
          }}
        />
        <section className="card admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Şehir</th>
                <th>Pozisyon</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody id="admin-candidates-body">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#5f6e8c" }}>
                    Aday bulunamadı.
                  </td>
                </tr>
              ) : (
                candidates.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.fullName}</strong>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.city || "-"}</td>
                    <td>{c.title || "-"}</td>
                    <td>
                      <button type="button" className="btn-view" onClick={() => viewCandidate(c.id)}>
                        İncele
                      </button>
                      <button type="button" className="btn-delete" onClick={() => deleteCandidate(c.id)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
        <h2 className="section-title">Kayıtlı İşverenler</h2>
        <input
          type="text"
          id="search-employers"
          className="admin-search-box"
          placeholder="Şirket adına veya e-postasına göre ara..."
          value={employerSearch}
          onChange={(e) => {
            setEmployerSearch(e.target.value);
            renderDashboard(candidateSearch, e.target.value);
          }}
        />
        <section className="card admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Şirket Adı</th>
                <th>İletişim Kişisi</th>
                <th>E-posta</th>
                <th>Açık İlan Sayısı</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody id="admin-employers-body">
              {employers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#5f6e8c" }}>
                    İşveren bulunamadı.
                  </td>
                </tr>
              ) : (
                employers.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <strong>{e.company}</strong>
                    </td>
                    <td>{e.contactName}</td>
                    <td>{e.email}</td>
                    <td>{(e.positions || []).length} İlan</td>
                    <td>
                      <button type="button" className="btn-view" onClick={() => viewEmployer(e.id)}>
                        İncele
                      </button>
                      <button type="button" className="btn-delete" onClick={() => deleteEmployer(e.id)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
      {viewModal && (
        <AdminViewModal title={viewModal.title} onClose={() => setViewModal(null)}>
          {viewModal.content}
        </AdminViewModal>
      )}
    </Layout>
  );
}
