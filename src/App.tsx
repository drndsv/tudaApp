// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import EventsPage from "./pages/EventsPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import EventDetailsPage from "./pages/EventDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserEventsPage from "./pages/userPages/UserEventsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventsPage />} />
      <Route path="/event/:id" element={<EventDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/userEvents" element={<UserEventsPage />} />
    </Routes>
  );
}

export default App;
