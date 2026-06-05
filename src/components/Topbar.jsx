import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutModal from "./LogoutModal";

const LOGO = "/assets/img/logo-placeholder.svg";

export default function Topbar({ brandLabel = "CVConnect" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };

  return (
    <>
      <header className="topbar">
        <div className="container topbar-content">
          <Link className="brand" to="/">
            <img className="brand-logo" src={LOGO} alt="CVConnect Logo" />
            <span>{brandLabel}</span>
          </Link>
          <nav className="nav">
            <NavLink data-nav to="/" end>
              Ana Sayfa
            </NavLink>
            <NavLink data-nav to="/candidate-search">
              Çalışan Ara
            </NavLink>
            <NavLink data-nav to="/jobs">
              İlanlar
            </NavLink>
            {user?.userType === "admin" && (
              <NavLink data-nav to="/admin">
                Yönetim Paneli
              </NavLink>
            )}
            {user && user.userType !== "admin" && (
              <>
                <NavLink data-nav to="/inbox">
                  Mesajlar
                </NavLink>
                <NavLink data-nav to="/profile">
                  Profilim
                </NavLink>
              </>
            )}
            {user ? (
              <a
                href="#logout"
                id="logout-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogout(true);
                }}
              >
                Çıkış Yap
              </a>
            ) : (
              <NavLink data-nav to="/welcome">
                Giriş Yap / Kayıt Ol
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      {showLogout && (
        <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />
      )}
    </>
  );
}
