"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shell/BrandLogo";
import { Button } from "@/components/ui/Button";
import { OnboardingStepper, StepInfo } from "@/components/onboarding/OnboardingStepper";
import { StepBasicDetails } from "@/components/onboarding/StepBasicDetails";
import { StepPreferences } from "@/components/onboarding/StepPreferences";
import { StepSkillsExperience } from "@/components/onboarding/StepSkillsExperience";
import { StepResumeUpload } from "@/components/onboarding/StepResumeUpload";
import { StepPortfolioLinks } from "@/components/onboarding/StepPortfolioLinks";
import { StepReviewConfirm } from "@/components/onboarding/StepReviewConfirm";
import {
  CompleteStudentProfile,
  EducationEntry,
  CareerPreferences,
  WorkExperienceEntry,
  ProjectEntry,
  PortfolioLinks,
  ExtractedResumeData,
} from "@/types/student";
import { saveStudentProfile } from "@/lib/api/profileService";
import { useAuth } from "@/lib/auth/AuthContext";
import { updateStudentProfile } from "@/lib/supabase/client";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

const steps: StepInfo[] = [
  { number: 1, title: "Basic Details", shortDesc: "Academic Credentials" },
  { number: 2, title: "Preferences", shortDesc: "Roles & Location" },
  { number: 3, title: "Skills & Projects", shortDesc: "Engineering Stack" },
  { number: 4, title: "Resume Upload", shortDesc: "Document Extraction" },
  { number: 5, title: "Portfolio Links", shortDesc: "GitHub & Showcases" },
  { number: 6, title: "Review & Confirm", shortDesc: "Final Verification" },
];

function getInitialDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("onboarding_draft");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const draft = getInitialDraft();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 State with lazy initializers
  const [fullName, setFullName] = useState(
    draft?.fullName || user?.fullName || "Aarav Sharma"
  );
  const [email, setEmail] = useState(
    draft?.email || user?.email || "aarav.sharma@campus.edu.in"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [education, setEducation] = useState<EducationEntry>({
    id: "edu-1",
    college:
      draft?.college || user?.college || "Indian Institute of Information Technology",
    degree: user?.degree || "B.Tech",
    branch: "Computer Science and Engineering",
    academicYear: "3rd Year",
    graduationYear: user?.graduatingYear || 2027,
  });

  // Step 2 State
  const [preferences, setPreferences] = useState<CareerPreferences>({
    desiredRoles: ["Software Development Engineer (SDE)", "Frontend Engineer"],
    careerInterests: ["Web Platforms", "Distributed Systems"],
    preferredIndustries: ["Financial Technology (FinTech)", "Developer Tooling & Cloud Platforms"],
    preferredLocations: ["Bengaluru, Karnataka", "Remote (India)"],
    workModePreference: "hybrid",
    opportunityTypePreference: "all",
    shortTermGoals: "Secure a product engineering internship for Summer 2027.",
  });

  // Step 3 State
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Go",
  ]);
  const [softSkills, setSoftSkills] = useState<string[]>([
    "Problem Solving",
    "Cross-functional Collaboration",
  ]);
  const [workExperience, setWorkExperience] = useState<WorkExperienceEntry[]>([]);
  const [projects, setProjects] = useState<ProjectEntry[]>([
    {
      id: "proj-1",
      title: "Vidya Sarthi UI Platform",
      description: "Accessible Next.js 16 opportunity matching surface",
      technologies: ["TypeScript", "Next.js", "Tailwind CSS"],
    },
  ]);

  // Step 4 State
  const [resumeData, setResumeData] = useState<ExtractedResumeData | undefined>(undefined);

  // Step 5 State
  const [portfolio, setPortfolio] = useState<PortfolioLinks>({
    githubUrl: "https://github.com/aarav-sharma",
    linkedinUrl: "https://linkedin.com/in/aarav-sharma",
    personalWebsite: "",
  });

  const validateCurrentStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!fullName.trim()) errs.fullName = "Full name is required";
      if (!email.trim()) errs.email = "Email is required";
      if (!education.college.trim()) errs.college = "College name is required";
      if (!education.branch.trim()) errs.branch = "Branch is required";
      if (!education.graduationYear) errs.graduationYear = "Graduation year is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > maxAccessibleStep) {
      setMaxAccessibleStep(next);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (stepNum: number) => {
    if (stepNum <= maxAccessibleStep) {
      setCurrentStep(stepNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleApplyExtractedSkills = (detected: string[]) => {
    setTechnicalSkills((prev) => {
      const combined = new Set([...prev, ...detected]);
      return Array.from(combined);
    });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const fullProfile: CompleteStudentProfile = {
      id: user?.id || `student-${Date.now()}`,
      fullName,
      email,
      phoneNumber,
      education,
      preferences,
      technicalSkills,
      softSkills,
      programmingLanguages: technicalSkills.filter((s) =>
        ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"].includes(s)
      ),
      toolsAndFrameworks: technicalSkills.filter(
        (s) => !["TypeScript", "JavaScript", "Python", "Go", "Java", "C++"].includes(s)
      ),
      workExperience,
      projects,
      certifications: [],
      portfolio,
      resume: resumeData,
      hasCompletedOnboarding: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveStudentProfile(fullProfile);

      // Sync with Supabase profiles table if active
      if (user?.id) {
        try {
          await updateStudentProfile(user.id, {
            full_name: fullName,
            college: education.college,
            degree: education.degree,
            graduating_year: education.graduationYear,
            location: preferences.preferredLocations[0] || "Bengaluru, Karnataka",
            skills: technicalSkills,
            target_roles: preferences.desiredRoles,
            preferred_locations: preferences.preferredLocations,
            preferred_work_modes: [preferences.workModePreference],
            resume_file_name: resumeData?.fileName,
            resume_raw_text: resumeData?.extractedTextPreview,
            has_completed_profile: true,
          });
        } catch (syncErr) {
          console.warn("Could not sync complete profile to Supabase:", syncErr);
        }
      }

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("onboarding_draft");
      }
      router.push("/profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullProfilePreview: CompleteStudentProfile = {
    id: user?.id || "student-001",
    fullName,
    email,
    phoneNumber,
    education,
    preferences,
    technicalSkills,
    softSkills,
    programmingLanguages: technicalSkills,
    toolsAndFrameworks: technicalSkills,
    workExperience,
    projects,
    certifications: [],
    portfolio,
    resume: resumeData,
    hasCompletedOnboarding: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[var(--ground)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <BrandLogo />
          <div className="text-left sm:text-right">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--charcoal-subtle)]">
              Student Onboarding Engine
            </span>
            <p className="text-xs text-[var(--charcoal-muted)]">
              Build your verified matching profile
            </p>
          </div>
        </div>

        {/* Multi-step progress stepper */}
        <OnboardingStepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          maxAccessibleStep={maxAccessibleStep}
        />

        {/* Step Content Container */}
        <motion.div
          key={currentStep}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 sm:p-10 shadow-[var(--shadow-card)]"
        >
          {currentStep === 1 && (
            <StepBasicDetails
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              education={education}
              setEducation={setEducation}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <StepPreferences
              preferences={preferences}
              setPreferences={setPreferences}
            />
          )}

          {currentStep === 3 && (
            <StepSkillsExperience
              technicalSkills={technicalSkills}
              setTechnicalSkills={setTechnicalSkills}
              softSkills={softSkills}
              setSoftSkills={setSoftSkills}
              workExperience={workExperience}
              setWorkExperience={setWorkExperience}
              projects={projects}
              setProjects={setProjects}
            />
          )}

          {currentStep === 4 && (
            <StepResumeUpload
              resumeData={resumeData}
              setResumeData={setResumeData}
              onApplyExtractedSkills={handleApplyExtractedSkills}
            />
          )}

          {currentStep === 5 && (
            <StepPortfolioLinks
              portfolio={portfolio}
              setPortfolio={setPortfolio}
            />
          )}

          {currentStep === 6 && (
            <StepReviewConfirm
              profile={fullProfilePreview}
              onEditStep={(stepNum) => setCurrentStep(stepNum)}
            />
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[var(--border-subtle)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentStep === 1}
              onClick={handlePrev}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {currentStep < 6 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Step {currentStep + 1}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                onClick={handleFinalSubmit}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Onboarding & Enter Profile
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
