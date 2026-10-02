"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shell/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isSupabaseActive } = useAuth();

  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic password strength evaluation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "Empty", color: "bg-[var(--border)]" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-[var(--danger)]" };
    if (score <= 3) return { score: 2, label: "Fair", color: "bg-[var(--warning)]" };
    return { score: 3, label: "Strong", color: "bg-[var(--success)]" };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !college.trim() || !email.trim()) {
      setError("Please complete all academic profile fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the student terms to proceed.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp(email, password, {
        fullName: fullName.trim(),
        college: college.trim(),
        graduatingYear: 2027,
      });

      if (!res.success) {
        setError(res.error || "Registration failed. Please check your credentials.");
        return;
      }

      // Pre-seed profile information in storage
      if (typeof window !== "undefined") {
        const initial = {
          fullName: fullName.trim(),
          college: college.trim(),
          email: email.trim(),
          hasCompletedOnboarding: false,
        };
        sessionStorage.setItem("onboarding_draft", JSON.stringify(initial));
      }
      // Redirect to multi-step onboarding
      router.push("/onboarding");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please check your network and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ground)] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg space-y-6"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo showTagline={false} />
          <h1 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight pt-2">
            Create student profile
          </h1>
          <p className="text-xs text-[var(--charcoal-muted)] max-w-sm">
            Direct student registration with ID & password to unlock verified opportunities and profile matching
          </p>

          <div className="pt-1">
            <Badge variant={isSupabaseActive ? "success" : "neutral"} monospace dot>
              <Database className="w-3 h-3 inline mr-1" />
              {isSupabaseActive ? "SUPABASE AUTH CONNECTED" : "OFFLINE / LOCAL AUTH MODE"}
            </Badge>
          </div>
        </div>

        {/* Register Container */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-5">
          {error && (
            <div
              role="alert"
              className="p-3.5 rounded-[var(--radius-md)] bg-[var(--danger-subtle)] border border-[#FECDD3] text-xs text-[var(--danger)] font-medium leading-relaxed"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full Name"
                placeholder="e.g. Priya Iyer"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
                autoComplete="name"
              />

              <Input
                label="College or University"
                placeholder="e.g. NIT Surathkal"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                leftIcon={<GraduationCap className="w-4 h-4" />}
                required
              />
            </div>

            <Input
              label="Campus or Personal Email"
              type="email"
              placeholder="priya@college.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[var(--charcoal-subtle)] hover:text-[var(--charcoal)] cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  required
                  autoComplete="new-password"
                />

                {/* Password strength bar */}
                {password && (
                  <div className="pt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-[var(--surface-subtle)] rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full flex-1 transition-all ${
                          passwordStrength.score >= 1
                            ? passwordStrength.color
                            : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 transition-all ${
                          passwordStrength.score >= 2
                            ? passwordStrength.color
                            : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 transition-all ${
                          passwordStrength.score >= 3
                            ? passwordStrength.color
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--charcoal-subtle)]">
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
                autoComplete="new-password"
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 pt-1 text-xs text-[var(--charcoal-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-[var(--radius-xs)] border-[var(--border)] text-[var(--cobalt)] accent-[var(--cobalt)] focus:ring-[var(--cobalt)]"
              />
              <span>
                I agree to the{" "}
                <span className="text-[var(--charcoal)] font-semibold underline">
                  Student Verification Terms
                </span>{" "}
                and acknowledge opportunity data is matched against my profile.
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Onboarding
            </Button>
          </form>

          {/* Link to login */}
          <div className="pt-2 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--charcoal-muted)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--cobalt)] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--charcoal-subtle)]">
          <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
          <span>Encrypted with strict university privacy standards</span>
        </div>
      </motion.div>
    </div>
  );
}
