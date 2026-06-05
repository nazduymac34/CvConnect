document.addEventListener("DOMContentLoaded", () => {

  const listEl = document.getElementById("job-results");
  if (!listEl) return;

  const employers = CVConnectStore.getEmployers();
  if (employers.length === 0) {
    listEl.innerHTML = `<div class="empty">Henüz kayıtlı işveren yok.</div>`;
    return;
  }

  const html = employers
    .map((e) => {
      const positions = (e.positions || [])
        .map(
          (p) => `
            <div class="card" style="box-shadow:none;">
              <h4>${p.title}</h4>
              <p class="meta">${p.level} • ${p.type}</p>
              <p>${p.description}</p>
            </div>
          `
        )
        .join("");

      return `
        <article class="card">
          <h3>${e.company}</h3>
          <p class="meta">${e.sector} • ${e.location}</p>
          <p>${e.about}</p>
          <p class="meta">İletişim: ${e.contactName} (${e.email})</p>
          <div class="result-grid">${positions}</div>
        </article>
      `;
    })
    .join("");

  listEl.innerHTML = html;
});

