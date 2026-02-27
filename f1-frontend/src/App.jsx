import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";

/* ================= AUTH ================= */
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Unauthorized from "./pages/auth/Unauthorized";

/* ================= USER / PUBLIC ================= */
import UserDashboard from "./pages/user/UserDashboard";
import NewsPage from "./pages/user/NewsPage";
import NewsDetails from "./pages/user/NewsDetails";
import CircuitDetails from "./pages/user/CircuitDetails";
import Schedule2026 from "./pages/user/Schedule2026";
import RaceDetails from "./pages/user/RaceDetails";
import TeamsPage from "./pages/user/TeamsPage";
import TeamDetails from "./pages/user/TeamDetails";
import DriversPage from "./pages/user/DriversPage";
import DriverProfile from "./pages/user/DriverProfile";
import Standings2025 from "./pages/user/Standings2025";
import EventsPage from "./pages/user/EventsPage";
import TicketBooking from "./pages/user/TicketBooking";
import RaceTickets from "./pages/user/RaceTickets";
import MyBookings from "./pages/user/MyBookings";
import RaceBooking from "./pages/user/RaceBooking";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageNews from "./pages/admin/ManageNews";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageSchedule from "./pages/admin/ManageSchedule";
import ManageCircuits from "./pages/admin/ManageCircuits";
import ManageSessions from "./pages/admin/ManageSessions";
import ManageTeams from "./pages/admin/ManageTeams";
import ManageDrivers from "./pages/admin/ManageDrivers";

import AdminBookings from "./pages/admin/AdminBookings";
import ManageTickit from "./pages/admin/ManageTickit";
import TicketList from "./pages/user/TicketList";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ================= PUBLIC + USER (WITH NAVBAR) ================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<UserDashboard />} />

            {/* ===== NEWS ===== */}
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetails />} />

            {/* ===== CIRCUITS & RACES ===== */}
            <Route path="/circuit/:id" element={<CircuitDetails />} />
            <Route path="/schedule/2026" element={<Schedule2026 />} />
            <Route path="/race/:id" element={<RaceDetails />} />

            {/* ===== TEAMS ===== */}
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:id" element={<TeamDetails />} />

            {/* ===== DRIVERS ===== */}
            <Route path="/drivers" element={<DriversPage />} />
            <Route path="/drivers/:id" element={<DriverProfile />} />

            {/* ===== STANDINGS ===== */}
            <Route path="/standings" element={<Standings2025 />} />

            {/* ===== TICKETS ===== */}
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId/book" element={<TicketBooking />} />
            <Route path="/race/:raceId/book" element={<RaceBooking />} />
            <Route path="/race/:raceId/tickets" element={<RaceTickets />} />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute role="USER">
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* ===== USER DASHBOARD (PROTECTED) ===== */}
            <Route
              path="/user"
              element={
                <ProtectedRoute role="USER">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ================= AUTH (NO NAVBAR) ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/news"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageNews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/schedule"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageSchedule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/circuits"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageCircuits />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/sessions"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageSessions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teams"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageTeams />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/drivers"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageDrivers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminBookings />
              </ProtectedRoute>
            }
          />



          <Route
            path="/admin/tikit"
            element={
              <ProtectedRoute role="ADMIN">
                <ManageTickit />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 ================= */}
          <Route
            path="*"
            element={
              <h1 style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
                404 – Page Not Found
              </h1>
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
