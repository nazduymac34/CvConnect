import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormFeedback from "../components/FormFeedback";
import { CVConnectStore } from "../store/storage";

export default function CandidateRegister() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [photoData, setPhotoData] = useState("");

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoData(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const skills = String(data.get("skills") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    CVConnectStore.addCandidate({
      fullName: String(data.get("fullName") || "").trim(),
      title: String(data.get("title") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      city: String(data.get("city") || "").trim(),
      experience: Number(data.get("experience") || 0),
      skills,
      bio: String(data.get("bio") || "").trim(),
      photo: photoData,
      password: String(data.get("password") || "").trim(),
    });

    form.reset();
    setPhotoData("");
    setFeedback("Profil başarıyla kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <Layout>
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">İş Arayan Kayıt Formu</h1>
          <p className="lead">Adaylar profil bilgilerini ve fotoğraflarını ekleyerek görünür olabilir.</p>
        </section>
        <section className="card">
          <form id="candidate-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Ad Soyad
                <input name="fullName" required />
              </label>
              <label>
                Hedef Pozisyon
                <input name="title" required />
              </label>
              <label>
                E-posta
                <input type="email" name="email" required />
              </label>
              <label>
                Telefon
                <input name="phone" required />
              </label>
              <label>
                Şehir
                <input name="city" required />
              </label>
              <label>
                Deneyim (yıl)
                <input type="number" min="0" name="experience" required />
              </label>
              <label>
                Şifre
                <input type="password" name="password" required />
              </label>
            </div>
            <label>
              Yetenekler (virgülle ayırın)
              <input name="skills" placeholder="React, Node.js, Figma" />
            </label>
            <label>
              Kısa Biyografi
              <textarea name="bio" required />
            </label>
            <label>
              Profil Fotoğrafı
              <input id="photo" type="file" accept="image/*" onChange={handlePhoto} />
            </label>
            <button className="btn btn-primary" type="submit">
              Profili Kaydet
            </button>
            <FormFeedback message={feedback} />
          </form>
        </section>
      </main>
    </Layout>
  );
}
