import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import FormFeedback from "../components/FormFeedback";
import { CVConnectStore } from "../store/storage";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setFeedback("E-posta ve şifre zorunludur.");
      return;
    }

    const result = login(trimmedEmail, trimmedPassword);
    if (result?.success) {
      navigate("/");
      return;
    }
    if (result?.reason === "not_found") {
      setFeedback(
        `Sistemde ${trimmedEmail} adresiyle kayıtlı bir hesap bulunamadı. (Tarayıcı geçmişinizi temizlediyseniz localStorage verileriniz silinmiş olabilir.)`
      );
    } else if (result?.reason === "wrong_password") {
      setFeedback("Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.");
    }
  };

  return (
    <Layout>
      <main className="container">
        <section className="page-head">
          <h1 className="page-title">Sisteme Giriş Yap</h1>
          <p className="lead">E-posta ve şifrenizle giriş yaparak profilinize ulaşın.</p>
        </section>
        <section className="card" style={{ maxWidth: 500, margin: "0 auto" }}>
          <form id="login-form" onSubmit={handleSubmit}>
            <label>
              E-posta
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Şifre
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                style={{ cursor: "pointer", marginLeft: 5 }}
                title="Şifreyi göster/gizle"
                onClick={() => setShowPassword((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setShowPassword((v) => !v)}
              >
                {showPassword ? "🔒" : "👁️"}
              </span>
            </label>
            <button className="btn btn-primary" type="submit" style={{ marginTop: 10 }}>
              Giriş Yap
            </button>
            <FormFeedback message={feedback} variant="error" />
          </form>
        </section>
      </main>
    </Layout>
  );
}
