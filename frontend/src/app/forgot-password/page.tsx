"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shell/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Simulate sending recovery email
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
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
            Reset password
          </h1>
          <p className="text-xs text-[var(--charcoal-muted)] max-w-xs">
            Enter your university or registered email address and we will send you password recovery instructions
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 sm:p-8 shadow-[var(--shadow-card)] space-y-5">
          {isSent ? (
            <div className="text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-[var(--success-subtle)] text-[var(--success)] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[var(--charcoal)]">
                Recovery email sent
              </h3>
              <p className="text-xs text-[var(--charcoal-muted)] leading-relaxed">
                If an account exists for <strong className="text-[var(--charcoal)]">{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <div className="pt-3">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="student@campus.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11"
                isLoading={isSubmitting}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--charcoal-muted)] hover:text-[var(--charcoal)]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
