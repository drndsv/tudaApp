// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import EventsPage from "./pages/EventsPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import EventDetailsPage from "./pages/EventDetailsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventsPage />} />
      <Route path="/event/:id" element={<EventDetailsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
