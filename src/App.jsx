import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import CandidateRegister from "./pages/CandidateRegister";
import EmployerRegister from "./pages/EmployerRegister";
import CandidateSearch from "./pages/CandidateSearch";
import Jobs from "./pages/Jobs";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/candidate-register" element={<CandidateRegister />} />
      <Route path="/employer-register" element={<EmployerRegister />} />
      <Route path="/candidate-search" element={<CandidateSearch />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/inbox" element={<Inbox />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
