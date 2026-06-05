document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("candidate-form");
  const feedback = document.getElementById("candidate-feedback");
  const photoInput = document.getElementById("photo");
  let photoData = "";

  photoInput?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photoData = String(reader.result || "");
    };
    reader.readAsDataURL(file);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
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
    photoData = "";
    CVConnectUI.notify(feedback, "Profil başarıyla kaydedildi. Giriş sayfasına yönlendiriliyorsunuz...");
    
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  });
});

