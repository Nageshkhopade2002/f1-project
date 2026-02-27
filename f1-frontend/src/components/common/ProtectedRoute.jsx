import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role mismatch
  if (role && ![].concat(role).includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
