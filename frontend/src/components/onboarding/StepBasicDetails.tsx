"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EducationEntry, AcademicYear } from "@/types/student";
import { User, Mail, Phone, GraduationCap, BookOpen, Calendar } from "lucide-react";

interface StepBasicDetailsProps {
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  education: EducationEntry;
  setEducation: React.Dispatch<React.SetStateAction<EducationEntry>>;
  errors: Record<string, string>;
}

const academicYears: AcademicYear[] = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Final Year",
  "Postgraduate",
];

const degreeOptions = [
  { label: "B.Tech - Bachelor of Technology", value: "B.Tech" },
  { label: "B.E. - Bachelor of Engineering", value: "B.E." },
  { label: "B.C.A. - Bachelor of Computer Applications", value: "BCA" },
  { label: "B.Sc - Computer Science / IT", value: "B.Sc CS" },
  { label: "M.Tech - Master of Technology", value: "M.Tech" },
  { label: "M.C.A. - Master of Computer Applications", value: "MCA" },
  { label: "Diploma in Engineering", value: "Diploma" },
  { label: "Other Degree", value: "Other" },
];

export const StepBasicDetails: React.FC<StepBasicDetailsProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  education,
  setEducation,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Basic & Academic Details
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-1">
          Verify your personal identity and enrolled institution for accurate opportunity matching
        </p>
      </div>

      <div className="space-y-4">
        {/* Personal Details Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Aarav Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            error={errors.fullName}
            required
          />

          <Input
            label="Campus or Primary Email *"
            type="email"
            placeholder="aarav@campus.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Number (Optional)"
            type="tel"
            placeholder="+91 98765 43210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            hint="For interview SMS updates only"
          />

          <Input
            label="College or University *"
            placeholder="e.g. IIIT Bengaluru, NIT Trichy"
            value={education.college}
            onChange={(e) =>
              setEducation((prev) => ({ ...prev, college: e.target.value }))
            }
            leftIcon={<GraduationCap className="w-4 h-4" />}
            error={errors.college}
            required
          />
        </div>

        {/* Academic Details Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Select
            label="Degree Program *"
            options={degreeOptions}
            value={education.degree}
            onChange={(e) =>
              setEducation((prev) => ({ ...prev, degree: e.target.value }))
            }
            error={errors.degree}
          />

          <Input
            label="Branch or Specialization *"
            placeholder="e.g. Computer Science, AI & ML, ECE"
            value={education.branch}
            onChange={(e) =>
              setEducation((prev) => ({ ...prev, branch: e.target.value }))
            }
            leftIcon={<BookOpen className="w-4 h-4" />}
            error={errors.branch}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Current Academic Standing *"
            options={academicYears.map((yr) => ({ label: yr, value: yr }))}
            value={education.academicYear}
            onChange={(e) =>
              setEducation((prev) => ({
                ...prev,
                academicYear: e.target.value as AcademicYear,
              }))
            }
          />

          <Input
            label="Expected Graduation Year *"
            type="number"
            min={2024}
            max={2032}
            placeholder="2027"
            value={education.graduationYear || ""}
            onChange={(e) =>
              setEducation((prev) => ({
                ...prev,
                graduationYear: parseInt(e.target.value, 10) || 2027,
              }))
            }
            leftIcon={<Calendar className="w-4 h-4" />}
            error={errors.graduationYear}
            required
          />
        </div>
      </div>
    </div>
  );
};
