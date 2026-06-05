document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("profile-container");
  const user = CVConnectStore.getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (user.userType === "candidate") {
    container.innerHTML = `
      <form id="profile-form">
        <div class="form-grid">
          <label>Ad Soyad<input name="fullName" required value="${user.fullName || ''}" /></label>
          <label>Hedef Pozisyon<input name="title" required value="${user.title || ''}" /></label>
          <label>E-posta<input type="email" name="email" required value="${user.email || ''}" /></label>
          <label>Telefon<input name="phone" required value="${user.phone || ''}" /></label>
          <label>Şehir<input name="city" required value="${user.city || ''}" /></label>
          <label>Deneyim (yıl)<input type="number" min="0" name="experience" required value="${user.experience || 0}" /></label>
        </div>
        <label>Yetenekler (virgülle ayırın)<input name="skills" value="${(user.skills || []).join(', ')}" /></label>
        <label>Kısa Biyografi<textarea name="bio" required>${user.bio || ''}</textarea></label>
        <label>Şifre (Değiştirmek istemiyorsanız boş bırakın)<input type="password" name="password" /></label>
        <button class="btn btn-primary" type="submit">Güncelle</button>
        <div id="profile-feedback" class="success hidden"></div>
      </form>
    `;

    document.getElementById("profile-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const skills = String(data.get("skills") || "").split(",").map((s) => s.trim()).filter(Boolean);
      
      const updateData = {
        fullName: String(data.get("fullName") || "").trim(),
        title: String(data.get("title") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        city: String(data.get("city") || "").trim(),
        experience: Number(data.get("experience") || 0),
        skills,
        bio: String(data.get("bio") || "").trim(),
      };
      
      const newPassword = String(data.get("password") || "").trim();
      if (newPassword) {
        updateData.password = newPassword;
      }

      CVConnectStore.updateCandidate(user.id, updateData);
      
      const feedback = document.getElementById("profile-feedback");
      CVConnectUI.notify(feedback, "Profil başarıyla güncellendi.");
    });
  }

  if (user.userType === "employer") {
    container.innerHTML = `
      <form id="profile-form">
        <div class="form-grid">
          <label>Şirket Adı<input name="company" required value="${user.company || ''}" /></label>
          <label>İletişim Yetkilisi<input name="contactName" required value="${user.contactName || ''}" /></label>
          <label>E-posta<input type="email" name="email" required value="${user.email || ''}" /></label>
          <label>Telefon<input name="phone" required value="${user.phone || ''}" /></label>
          <label>Sektör<input name="sector" required value="${user.sector || ''}" /></label>
          <label>Şehir<input name="location" required value="${user.location || ''}" /></label>
        </div>
        <label>Şirket Hakkında<textarea name="about" required>${user.about || ''}</textarea></label>
        <label>Şifre (Değiştirmek istemiyorsanız boş bırakın)<input type="password" name="password" /></label>
        <button class="btn btn-primary" type="submit">Güncelle</button>
        <div id="profile-feedback" class="success hidden"></div>
      </form>
    `;

    document.getElementById("profile-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      
      const updateData = {
        company: String(data.get("company") || "").trim(),
        contactName: String(data.get("contactName") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        sector: String(data.get("sector") || "").trim(),
        location: String(data.get("location") || "").trim(),
        about: String(data.get("about") || "").trim(),
      };

      const newPassword = String(data.get("password") || "").trim();
      if (newPassword) {
        updateData.password = newPassword;
      }

      CVConnectStore.updateEmployer(user.id, updateData);
      
      const feedback = document.getElementById("profile-feedback");
      CVConnectUI.notify(feedback, "İşveren profili başarıyla güncellendi.");
    });
  }
});

