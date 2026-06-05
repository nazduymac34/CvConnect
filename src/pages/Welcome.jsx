import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LOGO = "/assets/img/logo-placeholder.svg";

export default function Welcome() {
  const { user } = useAuth();

  useEffect(() => {
    document.body.classList.add("welcome-body");
    return () => document.body.classList.remove("welcome-body");
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="welcome-page">
      <div className="welcome-box">
        <img
          src={LOGO}
          alt="CVConnect Logo"
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            marginBottom: 20,
            objectFit: "cover",
            boxShadow: "0 10px 24px rgba(12, 67, 128, 0.24)",
          }}
        />
        <h1 className="welcome-title">CVConnect&apos;e Hoş Geldiniz</h1>
        <p className="welcome-subtitle">Platformu görüntülemek için lütfen kimliğinizi seçin.</p>
        <div className="welcome-options">
          <Link to="/candidate-register" className="option-card option-candidate">
            <h3>İş Arıyorum</h3>
            <p>Yeteneklerinizi sergileyin ve hayalinizdeki işi bulun.</p>
          </Link>
          <Link to="/employer-register" className="option-card option-employer">
            <h3>İşverenim</h3>
            <p>Şirket profilinizi oluşturun ve en iyi yetenekleri keşfedin.</p>
          </Link>
        </div>
        <div>
          <span style={{ color: "#5f6e8c" }}>Zaten bir hesabınız var mı?</span>
          <Link to="/login" className="login-link">
            Hemen Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
