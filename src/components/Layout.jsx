import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "./Topbar";
import Footer from "./Footer";

const PUBLIC_PATHS = ["/welcome", "/login", "/candidate-register", "/employer-register"];

export default function Layout({ children, brandLabel, footerText = "CVConnect", bodyClass = "" }) {
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [location.pathname, refreshUser]);

  useEffect(() => {
    if (bodyClass) {
      document.body.classList.add(bodyClass);
      return () => document.body.classList.remove(bodyClass);
    }
    return undefined;
  }, [bodyClass]);

  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  if (!user && !isPublic) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div className={bodyClass || undefined}>
      <Topbar brandLabel={brandLabel} />
      {children}
      <Footer>{footerText}</Footer>
    </div>
  );
}
