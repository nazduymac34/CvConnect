document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("candidate-results");
  const form = document.getElementById("filter-form");
  const messageForm = document.getElementById("message-form");
  const msgFeedback = document.getElementById("message-feedback");
  let targetCandidateId = "";

  const render = (items) => {
    if (!listEl) return;
    if (items.length === 0) {
      listEl.innerHTML = `<div class="empty">Filtreye uyan çalışan bulunamadı.</div>`;
      return;
    }

    listEl.innerHTML = items
      .map((c) => {
        const skills = (c.skills || []).map((s) => `<span class="chip">${s}</span>`).join("");
        const avatar = c.photo
          ? `<img class="avatar" src="${c.photo}" alt="${c.fullName}"/>`
          : `<div class="avatar avatar-fallback">${CVConnectUI.initials(c.fullName)}</div>`;

        return `
          <article class="card candidate-card">
            <div class="candidate-top">
              ${avatar}
              <div>
                <h3>${c.fullName}</h3>
                <p><strong>${c.title}</strong></p>
                <p class="meta">${c.city} • ${c.experience} yıl deneyim</p>
                <p class="meta">${c.email} • ${c.phone}</p>
              </div>
            </div>
            <p>${c.bio}</p>
            <div class="chips">${skills}</div>
            <button class="btn btn-primary" data-message="${c.id}">Mesaj Gönder</button>
          </article>
        `;
      })
      .join("");

    listEl.querySelectorAll("[data-message]").forEach((btn) => {
      btn.addEventListener("click", () => {
        targetCandidateId = btn.getAttribute("data-message");
        if (messageForm) {
          messageForm.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  };

  const applyFilters = () => {
    const data = new FormData(form);
    const city = String(data.get("city") || "").toLowerCase().trim();
    const skill = String(data.get("skill") || "").toLowerCase().trim();
    const minExp = Number(data.get("minExp") || 0);

    const items = CVConnectStore.getCandidates().filter((c) => {
      const passCity = !city || c.city.toLowerCase().includes(city);
      const passSkill =
        !skill || (c.skills || []).some((s) => s.toLowerCase().includes(skill));
      const passExp = Number(c.experience) >= minExp;
      return passCity && passSkill && passExp;
    });
    render(items);
  };

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  messageForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!targetCandidateId) {
      CVConnectUI.notify(msgFeedback, "Önce kartlardan bir çalışan seçin.");
      return;
    }

    const data = new FormData(messageForm);
    CVConnectStore.addMessage({
      toCandidateId: targetCandidateId,
      fromEmployer: String(data.get("company") || "").trim(),
      fromEmail: String(data.get("email") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
    });

    messageForm.reset();
    CVConnectUI.notify(msgFeedback, "Mesaj gönderildi ve kaydedildi.");
  });

  applyFilters();
});

