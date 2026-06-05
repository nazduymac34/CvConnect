document.addEventListener("DOMContentLoaded", () => {

  const listEl = document.getElementById("inbox-results");
  if (!listEl) return;

  const candidates = CVConnectStore.getCandidates();
  const candidateMap = new Map(candidates.map((c) => [c.id, c]));

  const messages = CVConnectStore.getMessages().sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  if (messages.length === 0) {
    listEl.innerHTML = `<div class="empty">Henüz gönderilmiş mesaj bulunmuyor.</div>`;
    return;
  }

  listEl.innerHTML = messages
    .map((m) => {
      const target = candidateMap.get(m.toCandidateId);
      const targetText = target
        ? `${target.fullName} (${target.title})`
        : "Bilinmeyen çalışan";
      const date = new Date(m.createdAt).toLocaleString("tr-TR");
      return `
        <article class="card">
          <h3>${m.subject}</h3>
          <p class="meta">Gönderen: ${m.fromEmployer} (${m.fromEmail})</p>
          <p class="meta">Alıcı: ${targetText}</p>
          <p class="meta">Tarih: ${date}</p>
          <p>${m.message}</p>
        </article>
      `;
    })
    .join("");
});

