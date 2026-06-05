document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("employer-form");
  const feedback = document.getElementById("employer-feedback");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);

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

    form.reset();
    CVConnectUI.notify(feedback, "İşveren profili kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...");
    
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
});

