import { Navigate } from "react-router-dom";

import AuthCard from "../components/auth/AuthCard";
import { useAuthStore } from "../store/auth";

export default function Login() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return <AuthCard />;
}
