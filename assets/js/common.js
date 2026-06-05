const CVConnectUI = (() => {
  const setActiveNav = () => {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.getAttribute("href").endsWith(path)) {
        link.classList.add("active");
      }
    });
  };

  const initials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() || "").join("");
  };

  const notify = (el, text) => {
    el.textContent = text;
    el.classList.remove("hidden");
  };

  const initAuth = () => {
    const user = CVConnectStore.getCurrentUser();
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const isRoot = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
    const basePath = isRoot ? "pages/" : "";
    const rootPath = isRoot ? "" : "../";

    const isPublicPage = window.location.pathname.includes("welcome.html") || 
                         window.location.pathname.includes("login.html") || 
                         window.location.pathname.includes("-register.html");
                         
    if (!user && !isPublicPage) {
      window.location.href = rootPath + "pages/welcome.html";
      return;
    }

    let links = `<a data-nav href="${rootPath}index.html">Ana Sayfa</a>`;
    links += `<a data-nav href="${basePath}candidate-search.html">Çalışan Ara</a>`;
    links += `<a data-nav href="${basePath}jobs.html">İlanlar</a>`;
    
    if (user) {
      if (user.userType === "admin") {
        links += `<a data-nav href="${basePath}admin.html">Yönetim Paneli</a>`;
      } else {
        links += `<a data-nav href="${basePath}inbox.html">Mesajlar</a>`;
        links += `<a data-nav href="${basePath}profile.html">Profilim</a>`;
      }
      links += `<a href="#" id="logout-btn">Çıkış Yap</a>`;
    } else {
      links += `<a data-nav href="${basePath}welcome.html">Giriş Yap / Kayıt Ol</a>`;
    }
    
    nav.innerHTML = links;

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const modalHtml = `
          <div class="logout-overlay" id="neon-logout-modal">
            <div class="logout-modal">
              <h2>Sistemden Çıkış</h2>
              <p>Oturumunuzu kapatmak istediğinize emin misiniz?</p>
              <div class="logout-actions">
                <button class="btn-neon-red" id="confirm-logout">Evet, Çıkış Yap</button>
                <button class="btn-neon-outline" id="cancel-logout">Hayır, İptal</button>
              </div>
            </div>
          </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById("cancel-logout").addEventListener("click", () => {
          document.getElementById("neon-logout-modal").remove();
        });
        
        document.getElementById("confirm-logout").addEventListener("click", () => {
          CVConnectStore.logout();
          window.location.href = rootPath + "pages/welcome.html";
        });
      });
    }
  };

  return { setActiveNav, initials, notify, initAuth };
})();

document.addEventListener("DOMContentLoaded", () => {
  CVConnectStore.seedIfEmpty();
  CVConnectUI.initAuth();
  CVConnectUI.setActiveNav();
});

