"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shell/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[var(--ground)] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-6"
      >
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo showTagline={false} />
          <h1 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight pt-2">
            Create new password
          </h1>
          <p className="text-xs text-[var(--charcoal-muted)] max-w-xs">
            Set a new secure password for your Vidya Sarthi student account
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-5">
          {isSuccess ? (
            <div className="text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-[var(--success-subtle)] text-[var(--success)] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[var(--charcoal)]">
                Password updated
              </h3>
              <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed">
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>
              <div className="pt-3">
                <Link href="/login">
                  <Button variant="primary" className="w-full">
                    Proceed to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--danger-subtle)] border border-[#FECDD3] text-xs text-[var(--danger)]">
                  {error}
                </div>
              )}

              <Input
                label="New Password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[var(--charcoal-subtle)] hover:text-[var(--charcoal)] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Input
                label="Confirm New Password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11"
                isLoading={isSubmitting}
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
