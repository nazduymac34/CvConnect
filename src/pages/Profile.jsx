import { useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormFeedback from "../components/FormFeedback";
import { CVConnectStore } from "../store/storage";

export default function Profile() {
  const user = CVConnectStore.getCurrentUser();
  const [feedback, setFeedback] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.userType === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleCandidateSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const skills = String(data.get("skills") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
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
    if (newPassword) updateData.password = newPassword;
    CVConnectStore.updateCandidate(user.id, updateData);
    setFeedback("Profil başarıyla güncellendi.");
  };

  const handleEmployerSubmit = (e) => {
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
    if (newPassword) updateData.password = newPassword;
    CVConnectStore.updateEmployer(user.id, updateData);
    setFeedback("İşveren profili başarıyla güncellendi.");
  };

  return (
    <Layout>
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">Profil Yönetimi</h1>
          <p className="lead">Kayıtlı bilgilerinizi güncelleyebilirsiniz.</p>
        </section>
        <section className="card" id="profile-container">
          {user.userType === "candidate" && (
            <form id="profile-form" onSubmit={handleCandidateSubmit}>
              <div className="form-grid">
                <label>
                  Ad Soyad
                  <input name="fullName" required defaultValue={user.fullName || ""} />
                </label>
                <label>
                  Hedef Pozisyon
                  <input name="title" required defaultValue={user.title || ""} />
                </label>
                <label>
                  E-posta
                  <input type="email" name="email" required defaultValue={user.email || ""} />
                </label>
                <label>
                  Telefon
                  <input name="phone" required defaultValue={user.phone || ""} />
                </label>
                <label>
                  Şehir
                  <input name="city" required defaultValue={user.city || ""} />
                </label>
                <label>
                  Deneyim (yıl)
                  <input type="number" min="0" name="experience" required defaultValue={user.experience || 0} />
                </label>
              </div>
              <label>
                Yetenekler (virgülle ayırın)
                <input name="skills" defaultValue={(user.skills || []).join(", ")} />
              </label>
              <label>
                Kısa Biyografi
                <textarea name="bio" required defaultValue={user.bio || ""} />
              </label>
              <label>
                Şifre (Değiştirmek istemiyorsanız boş bırakın)
                <input type="password" name="password" />
              </label>
              <button className="btn btn-primary" type="submit">
                Güncelle
              </button>
              <FormFeedback message={feedback} />
            </form>
          )}
          {user.userType === "employer" && (
            <form id="profile-form" onSubmit={handleEmployerSubmit}>
              <div className="form-grid">
                <label>
                  Şirket Adı
                  <input name="company" required defaultValue={user.company || ""} />
                </label>
                <label>
                  İletişim Yetkilisi
                  <input name="contactName" required defaultValue={user.contactName || ""} />
                </label>
                <label>
                  E-posta
                  <input type="email" name="email" required defaultValue={user.email || ""} />
                </label>
                <label>
                  Telefon
                  <input name="phone" required defaultValue={user.phone || ""} />
                </label>
                <label>
                  Sektör
                  <input name="sector" required defaultValue={user.sector || ""} />
                </label>
                <label>
                  Şehir
                  <input name="location" required defaultValue={user.location || ""} />
                </label>
              </div>
              <label>
                Şirket Hakkında
                <textarea name="about" required defaultValue={user.about || ""} />
              </label>
              <label>
                Şifre (Değiştirmek istemiyorsanız boş bırakın)
                <input type="password" name="password" />
              </label>
              <button className="btn btn-primary" type="submit">
                Güncelle
              </button>
              <FormFeedback message={feedback} />
            </form>
          )}
        </section>
      </main>
    </Layout>
  );
}
