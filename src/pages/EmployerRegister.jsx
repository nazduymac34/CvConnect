import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormFeedback from "../components/FormFeedback";
import { CVConnectStore } from "../store/storage";

export default function EmployerRegister() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    CVConnectStore.addEmployer({
      company: String(data.get("company") || "").trim(),
      contactName: String(data.get("contactName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      sector: String(data.get("sector") || "").trim(),
      location: String(data.get("location") || "").trim(),
      about: String(data.get("about") || "").trim(),
      positions: [
        {
          title: String(data.get("positionTitle") || "").trim(),
          type: String(data.get("positionType") || "").trim(),
          level: String(data.get("positionLevel") || "").trim(),
          description: String(data.get("positionDescription") || "").trim(),
        },
      ],
      password: String(data.get("password") || "").trim(),
    });

    e.target.reset();
    setFeedback("İşveren profili kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <Layout>
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">İşveren ve Pozisyon Kaydı</h1>
          <p className="lead">Şirket bilgisi, iletişim kişisi ve açık rol detaylarını tek formda girin.</p>
        </section>
        <section className="card">
          <form id="employer-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Şirket Adı
                <input name="company" required />
              </label>
              <label>
                İletişim Yetkilisi
                <input name="contactName" required />
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
                Sektör
                <input name="sector" required />
              </label>
              <label>
                Şehir
                <input name="location" required />
              </label>
              <label>
                Şifre
                <input type="password" name="password" required />
              </label>
            </div>
            <label>
              Şirket Hakkında
              <textarea name="about" required />
            </label>
            <div className="form-grid">
              <label>
                Pozisyon Adı
                <input name="positionTitle" required />
              </label>
              <label>
                Pozisyon Tipi
                <select name="positionType" defaultValue="Tam Zamanlı">
                  <option>Tam Zamanlı</option>
                  <option>Yarı Zamanlı</option>
                  <option>Uzaktan</option>
                  <option>Staj</option>
                </select>
              </label>
              <label>
                Seviye
                <input name="positionLevel" placeholder="Junior / Mid / Senior" required />
              </label>
              <label>
                Pozisyon Açıklaması
                <textarea name="positionDescription" required />
              </label>
            </div>
            <button className="btn btn-primary" type="submit">
              İşveren Kaydını Oluştur
            </button>
            <FormFeedback message={feedback} />
          </form>
        </section>
      </main>
    </Layout>
  );
}
