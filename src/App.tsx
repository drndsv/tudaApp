import EventsPage from "./pages/EventsPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import EventDetailsPage from "./pages/EventDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserEventsPage from "./pages/userPages/UserEventsPage";
import CreateEventPage from "./pages/orgPages/CreateEventPage";
import OrganizerEventsPage from "./pages/orgPages/OrganizerEventsPage";
import OrganizerEventViewPage from "./pages/orgPages/OrganizerEventViewPage";
import EventParticipantsPage from "./pages/orgPages/EventParticipantsPage";
import EditEventPage from "./pages/orgPages/EditEventPage";
import EventRequestsPage from "./pages/orgPages/EventRequestsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* общие страницы */}
      <Route path="/" element={<EventsPage />} />
      <Route path="/event/:id" element={<EventDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* страницы и пользователя и орга */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/organizer/events/:id/participants"
          element={<EventParticipantsPage />}
        />
      </Route>

      {/* страницы пользователя */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_USER"]} />}>
        <Route path="/userEvents" element={<UserEventsPage />} />
      </Route>

      {/* страницы орга */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ORGANIZER"]} />}>
        <Route path="/createEvent" element={<CreateEventPage />} />
        <Route path="/organizerEvents" element={<OrganizerEventsPage />} />
        <Route
          path="/organizer/events/:id"
          element={<OrganizerEventViewPage />}
        />

        <Route path="/organizer/events/:id/edit" element={<EditEventPage />} />
        <Route
          path="/organizer/events/:id/requests"
          element={<EventRequestsPage />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
