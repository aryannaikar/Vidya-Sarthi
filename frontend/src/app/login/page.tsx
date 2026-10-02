"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shell/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Database } from "lucide-react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isSupabaseActive, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please provide both your registered email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn(email, password);
      if (!res.success) {
        setError(res.error || "Invalid credentials. Please verify your email and password.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
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
        className="w-full max-w-md space-y-6"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo showTagline={false} />
          <h1 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight pt-2">
            Student Portal Sign In
          </h1>
          <p className="text-xs text-[var(--charcoal-muted)] max-w-xs">
            Direct ID & password login to access your verified profile, recommendations, and applications
          </p>

          <div className="pt-1">
            <Badge variant={isSupabaseActive ? "success" : "neutral"} monospace dot>
              <Database className="w-3 h-3 inline mr-1" />
              {isSupabaseActive ? "SUPABASE AUTH CONNECTED" : "OFFLINE / LOCAL AUTH MODE"}
            </Badge>
          </div>
        </div>

        {/* Login Form Container */}
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
            <Input
              label="Student Email Address"
              type="email"
              placeholder="aarav.sharma@campus.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
              hint="Use your university or registered personal email"
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[var(--charcoal-subtle)] hover:text-[var(--charcoal)] cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                required
                autoComplete="current-password"
              />
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--charcoal-muted)]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-[var(--radius-xs)] border-[var(--border)] text-[var(--cobalt)] accent-[var(--cobalt)] focus:ring-[var(--cobalt)]"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--cobalt)] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In with ID & Password
            </Button>
          </form>

          {/* Quick Demo Access Note */}
          <div className="pt-2 border-t border-[var(--border-subtle)] text-center text-xs text-[var(--charcoal-muted)]">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="text-[var(--cobalt)] font-semibold hover:underline"
            >
              Register student account
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--charcoal-subtle)]">
          <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
          <span>Direct Supabase authentication • No third-party tracking</span>
        </div>
      </motion.div>
    </div>
  );
}
