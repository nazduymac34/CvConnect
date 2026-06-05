document.addEventListener("DOMContentLoaded", () => {
  const user = CVConnectStore.getCurrentUser();

  if (!user || user.userType !== "admin") {
    alert("Bu sayfayı görüntüleme yetkiniz yok.");
    window.location.href = "../index.html";
    return;
  }

  const statCandidates = document.getElementById("admin-stat-candidates");
  const statEmployers = document.getElementById("admin-stat-employers");
  const statJobs = document.getElementById("admin-stat-jobs");
  
  const candidatesBody = document.getElementById("admin-candidates-body");
  const employersBody = document.getElementById("admin-employers-body");

  const renderDashboard = (candidateSearch = "", employerSearch = "") => {
    const candidates = CVConnectStore.getCandidates();
    const employers = CVConnectStore.getEmployers();

    statCandidates.textContent = candidates.length;
    statEmployers.textContent = employers.length;
    
    let totalJobs = 0;
    employers.forEach(e => { totalJobs += (e.positions || []).length; });
    statJobs.textContent = totalJobs;

    const filteredCandidates = candidates.filter(c => 
      c.fullName.toLowerCase().includes(candidateSearch.toLowerCase()) || 
      c.email.toLowerCase().includes(candidateSearch.toLowerCase())
    );

    const filteredEmployers = employers.filter(e => 
      e.company.toLowerCase().includes(employerSearch.toLowerCase()) || 
      e.email.toLowerCase().includes(employerSearch.toLowerCase())
    );

    candidatesBody.innerHTML = filteredCandidates.length === 0 
      ? `<tr><td colspan="5" style="text-align: center; color: #5f6e8c;">Aday bulunamadı.</td></tr>`
      : filteredCandidates.map(c => `
          <tr>
            <td><strong>${c.fullName}</strong></td>
            <td>${c.email}</td>
            <td>${c.city || '-'}</td>
            <td>${c.title || '-'}</td>
            <td>
              <button class="btn-view" onclick="window.viewCandidate('${c.id}')">İncele</button>
              <button class="btn-delete" onclick="window.deleteCandidate('${c.id}')">Sil</button>
            </td>
          </tr>
        `).join("");

    employersBody.innerHTML = filteredEmployers.length === 0
      ? `<tr><td colspan="5" style="text-align: center; color: #5f6e8c;">İşveren bulunamadı.</td></tr>`
      : filteredEmployers.map(e => `
          <tr>
            <td><strong>${e.company}</strong></td>
            <td>${e.contactName}</td>
            <td>${e.email}</td>
            <td>${(e.positions || []).length} İlan</td>
            <td>
              <button class="btn-view" onclick="window.viewEmployer('${e.id}')">İncele</button>
              <button class="btn-delete" onclick="window.deleteEmployer('${e.id}')">Sil</button>
            </td>
          </tr>
        `).join("");
  };

  const searchCandidatesInput = document.getElementById("search-candidates");
  const searchEmployersInput = document.getElementById("search-employers");

  searchCandidatesInput.addEventListener("input", (e) => {
    renderDashboard(e.target.value, searchEmployersInput.value);
  });

  searchEmployersInput.addEventListener("input", (e) => {
    renderDashboard(searchCandidatesInput.value, e.target.value);
  });

  window.viewCandidate = (id) => {
    const c = CVConnectStore.getCandidates().find(x => x.id === id);
    if(!c) return;
    const html = `
      <div class="admin-modal-overlay" id="view-modal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title">Aday Profili</h3>
            <button class="admin-modal-close" onclick="document.getElementById('view-modal').remove()">&times;</button>
          </div>
          <div class="admin-modal-content">
            <p><strong>Ad Soyad:</strong> ${c.fullName}</p>
            <p><strong>Hedef Pozisyon:</strong> ${c.title}</p>
            <p><strong>Şehir:</strong> ${c.city}</p>
            <p><strong>Deneyim:</strong> ${c.experience} Yıl</p>
            <p><strong>Yetenekler:</strong> ${(c.skills || []).join(", ")}</p>
            <p><strong>Biyografi:</strong> ${c.bio}</p>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
  };

  window.viewEmployer = (id) => {
    const e = CVConnectStore.getEmployers().find(x => x.id === id);
    if(!e) return;
    const positionsHtml = (e.positions || []).map(p => `<li>${p.title} (${p.type} - ${p.level})</li>`).join("");
    const html = `
      <div class="admin-modal-overlay" id="view-modal">
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title">İşveren Profili</h3>
            <button class="admin-modal-close" onclick="document.getElementById('view-modal').remove()">&times;</button>
          </div>
          <div class="admin-modal-content">
            <p><strong>Şirket Adı:</strong> ${e.company}</p>
            <p><strong>Sektör:</strong> ${e.sector}</p>
            <p><strong>Şehir:</strong> ${e.location}</p>
            <p><strong>İletişim Yetkilisi:</strong> ${e.contactName} (${e.phone})</p>
            <p><strong>Hakkında:</strong> ${e.about}</p>
            <p><strong>Açık İlanlar:</strong></p>
            <ul>${positionsHtml || "İlan yok"}</ul>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", html);
  };

  window.deleteCandidate = (id) => {
    if (confirm("Bu adayı kalıcı olarak silmek istediğinize emin misiniz?")) {
      CVConnectStore.deleteCandidate(id);
      renderDashboard(searchCandidatesInput.value, searchEmployersInput.value);
    }
  };

  window.deleteEmployer = (id) => {
    if (confirm("Bu işvereni ve ona ait tüm iş ilanlarını silmek istediğinize emin misiniz?")) {
      CVConnectStore.deleteEmployer(id);
      renderDashboard(searchCandidatesInput.value, searchEmployersInput.value);
    }
  };

  renderDashboard();
});

