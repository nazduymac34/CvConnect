document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const feedback = document.getElementById("login-feedback");

  if (CVConnectStore.getCurrentUser()) {
    window.location.href = "../index.html";
    return;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "").trim();

    const result = CVConnectStore.login(email, password);
    const isSuccess = typeof result === "boolean" ? result : result?.success;

    if (isSuccess) {
      window.location.href = "../index.html";
    } else {
      if (result && result.reason === "not_found") {
        feedback.innerHTML = "Sistemde <strong>" + email + "</strong> adresiyle kayıtlı bir hesap bulunamadı.<br><small>(Tarayıcı geçmişinizi temizlediyseniz localStorage verileriniz silinmiş olabilir, lütfen tekrar kayıt olun.)</small>";
      } else if (result && result.reason === "wrong_password") {
        feedback.textContent = "Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.";
      }
      feedback.classList.remove("hidden");
    }
  });

  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = form?.querySelector('input[name="password"]');
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePassword.textContent = type === "password" ? "👁️" : "🔒";
    });
  }
});

