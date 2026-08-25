import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import AuthLayout from "../components/auth/AuthLayout";

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded pl-10 pr-4 py-2.5 text-body-md text-onSurface placeholder:text-onSurfaceVariant outline-none focus:border-accent transition-colors";

export const Register = () => {
  const { isAuthenticated, isLoading, register } = useAdminAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await register(name, email, password);
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Sign up to manage Cinestar venues.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded bg-accent/10 border border-accent/30 text-accent text-sm px-4 py-3">
            {error}
          </p>
        )}

        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant" />
          <input
            type="text"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

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
            minLength={6}
            autoComplete="new-password"
            placeholder="Password (min 6 characters)"
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
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-onSurfaceVariant text-body-md mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;