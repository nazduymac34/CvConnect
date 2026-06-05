document.addEventListener("DOMContentLoaded", () => {
  const candidates = CVConnectStore.getCandidates();
  const employers = CVConnectStore.getEmployers();
  const positions = employers.reduce((sum, e) => sum + (e.positions?.length || 0), 0);

  const cEl = document.getElementById("stat-candidates");
  const eEl = document.getElementById("stat-employers");
  const pEl = document.getElementById("stat-positions");

  if (cEl) cEl.textContent = candidates.length;
  if (eEl) eEl.textContent = employers.length;
  if (pEl) pEl.textContent = positions;
});

