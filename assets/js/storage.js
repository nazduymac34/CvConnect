const CVConnectStore = (() => {

  const KEYS = {
    candidates: "cvconnect_candidates",
    employers: "cvconnect_employers",
    messages: "cvconnect_messages",
    currentUser: "cvconnect_current_user",
  };

  const read = (key) => JSON.parse(localStorage.getItem(key) || "[]");
  const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));
  const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const seedIfEmpty = () => {
    if (read(KEYS.candidates).length === 0) {
      write(KEYS.candidates, [
        {
          id: uid(),
          fullName: "Elif Demir",
          title: "Frontend Developer",
          email: "elif@demo.com",
          phone: "+90 555 218 4401",
          city: "Istanbul",
          experience: 4,
          skills: ["React", "TypeScript", "CSS"],
          bio: "Kullanıcı deneyimi güçlü, performans odaklı ara yüzler geliştiririm.",
          photo: "",
          password: "123",
          createdAt: new Date().toISOString(),
        },
        {
          id: uid(),
          fullName: "Mert Yılmaz",
          title: "Node.js Developer",
          email: "mert@demo.com",
          phone: "+90 555 670 3210",
          city: "Ankara",
          experience: 6,
          skills: ["Node.js", "MongoDB", "Docker"],
          bio: "Ölçeklenebilir backend servisleri ve API tasarımı üzerine çalışıyorum.",
          photo: "",
          password: "123",
          createdAt: new Date().toISOString(),
        },

         {
          id: uid(),
          fullName: "Nur Melek Şenkul",
          title: "Frontend Developer",
          email: "nurmelek@demo.com",
          phone: "+90 552 370 3511",
          city: "Sakarya",
          experience: 3,
          skills: ["Node.js", "React", "Photoshop"],
          bio: "Ön yüz yazılım ve grafik tasarım üzerine çalışıyorum.",
          photo: "",
          password: "123",
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    if (read(KEYS.employers).length === 0) {
      write(KEYS.employers, [
        {
          id: uid(),
          company: "Nova Teknoloji",
          contactName: "Seda Aras",
          email: "ik@nova.com",
          phone: "+90 212 400 9911",
          sector: "Yazılım",
          location: "Istanbul",
          about: "Bulut tabanlı SaaS ürünleri geliştiriyoruz.",
          positions: [
            {
              title: "Frontend Developer",
              type: "Tam Zamanlı",
              level: "Mid-Senior",
              description: "React ve modern state yönetimi bilgisi.",
            },
          ],
          password: "123",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const getCandidates = () => read(KEYS.candidates);
  const addCandidate = (candidate) => {

    const all = getCandidates();
    all.push({ ...candidate, id: uid(), createdAt: new Date().toISOString() });
    write(KEYS.candidates, all);
  };

  const getEmployers = () => read(KEYS.employers);
  const addEmployer = (employer) => {

    const all = getEmployers();
    all.push({ ...employer, id: uid(), createdAt: new Date().toISOString() });
    write(KEYS.employers, all);
  };

  const getMessages = () => read(KEYS.messages);
  const addMessage = (message) => {

    const all = getMessages();
    all.push({ ...message, id: uid(), createdAt: new Date().toISOString() });
    write(KEYS.messages, all);
  };

  const login = (email, password) => {
    const searchEmail = email.toLowerCase().trim();

    if (searchEmail === "admin@cvconnect.com" && password === "Bjk_1903") {
      write(KEYS.currentUser, { id: "admin-1", userType: "admin", fullName: "Sistem Yöneticisi" });
      return { success: true };
    }

    const candidates = getCandidates();
    const candidate = candidates.find(c => (c.email || "").trim().toLowerCase() === searchEmail);
    if (candidate) {

      if (!candidate.password) {
        updateCandidate(candidate.id, { password: password });
        write(KEYS.currentUser, { ...candidate, password: password, userType: "candidate" });
        return { success: true };
      } else if (String(candidate.password) === String(password)) {
        write(KEYS.currentUser, { ...candidate, userType: "candidate" });
        return { success: true };
      } else {
        return { success: false, reason: "wrong_password" };
      }
    }

    const employers = getEmployers();
    const employer = employers.find(e => (e.email || "").trim().toLowerCase() === searchEmail);
    if (employer) {

      if (!employer.password) {
        updateEmployer(employer.id, { password: password });
        write(KEYS.currentUser, { ...employer, password: password, userType: "employer" });
        return { success: true };
      } else if (String(employer.password) === String(password)) {
        write(KEYS.currentUser, { ...employer, userType: "employer" });
        return { success: true };
      } else {
        return { success: false, reason: "wrong_password" };
      }
    }

    return { success: false, reason: "not_found" };
  };

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(KEYS.currentUser) || "null");
  };

  const logout = () => {
    localStorage.removeItem(KEYS.currentUser);
  };

  const updateCandidate = (id, data) => {
    let all = getCandidates();
    const index = all.findIndex(c => c.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...data };
      write(KEYS.candidates, all);
      if (getCurrentUser()?.id === id) write(KEYS.currentUser, { ...all[index], userType: "candidate" });
    }
  };

  const updateEmployer = (id, data) => {
    let all = getEmployers();
    const index = all.findIndex(e => e.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...data };
      write(KEYS.employers, all);
      if (getCurrentUser()?.id === id) write(KEYS.currentUser, { ...all[index], userType: "employer" });
    }
  };

  const deleteCandidate = (id) => {
    let all = getCandidates();
    all = all.filter(c => c.id !== id);
    write(KEYS.candidates, all);
  };

  const deleteEmployer = (id) => {
    let all = getEmployers();
    all = all.filter(e => e.id !== id);
    write(KEYS.employers, all);
  };

  return {
    seedIfEmpty,
    getCandidates,
    addCandidate,
    updateCandidate,
    getEmployers,
    addEmployer,
    updateEmployer,
    getMessages,
    addMessage,
    login,
    getCurrentUser,
    logout,
    deleteCandidate,
    deleteEmployer
  };
})();

