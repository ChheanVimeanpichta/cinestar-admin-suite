import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import AuthLayout from "../components/auth/AuthLayout";

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded pl-10 pr-4 py-2.5 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors";

export const Login = () => {
  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Access the Cinestar admin dashboard.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded bg-accent/10 border border-accent/30 text-accent text-sm px-4 py-3">
            {error}
          </p>
        )}

        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 py-3 rounded bg-accent text-onSurface text-sm font-body font-semibold hover:brightness-110 transition disabled:opacity-60 mt-2"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-4 p-3 rounded bg-white/5 border border-white/10 text-xs text-onSurfaceVariant">
        <p className="font-medium text-onSurface mb-1">Default Demo Admin:</p>
        <p>Email: <span className="font-mono text-accent">admin@gmail.com</span></p>
        <p>Password: <span className="font-mono text-accent">cinestar123</span></p>
      </div>
    </AuthLayout>
  );
};

export default Login;
