"use client";

import React, { useState, useRef } from "react";
import { ExtractedResumeData } from "@/types/student";
import { uploadAndParseResume, validateResumeFile } from "@/lib/api/resumeService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  UploadCloud,
  FileText,
  AlertCircle,
  RefreshCw,
  Info,
} from "lucide-react";

interface StepResumeUploadProps {
  resumeData?: ExtractedResumeData;
  setResumeData: React.Dispatch<
    React.SetStateAction<ExtractedResumeData | undefined>
  >;
  onApplyExtractedSkills?: (skills: string[]) => void;
}

export const StepResumeUpload: React.FC<StepResumeUploadProps> = ({
  resumeData,
  setResumeData,
  onApplyExtractedSkills,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "File validation failed");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const result = await uploadAndParseResume(file, (p) =>
        setUploadProgress(p)
      );

      if (result.success && result.data) {
        setResumeData(result.data);
      } else {
        setErrorMessage(
          result.error || "Failed to parse document. You can retry or proceed manually."
        );
      }
    } catch {
      setErrorMessage(
        "Network connection interrupted while processing resume. Please retry."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <h3 className="text-lg font-semibold text-[var(--charcoal)] tracking-tight">
          Resume Upload & Document Intelligence
        </h3>
        <p className="text-xs text-[var(--charcoal-muted)] mt-1">
          Upload your resume (PDF, DOC, DOCX up to 5MB). Extracted details will be presented for your verification before being committed.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--danger-subtle)] border border-[#FECDD3] flex items-start gap-2.5 text-xs text-[var(--danger)]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Upload notice: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      {!resumeData ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius-xl)] bg-[var(--surface)] p-8 sm:p-12 text-center cursor-pointer hover:border-[var(--cobalt)] hover:bg-[var(--surface-subtle)] transition-all space-y-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-full bg-[var(--cobalt-light)] text-[var(--cobalt)] flex items-center justify-center mx-auto shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--charcoal)]">
              Drop your resume here or browse files
            </h4>
            <p className="text-xs text-[var(--charcoal-muted)] mt-1">
              Supports PDF, DOC, DOCX up to 5 megabytes
            </p>
          </div>

          {isUploading && (
            <div className="max-w-xs mx-auto pt-3 space-y-1.5">
              <div className="h-1.5 w-full bg-[var(--surface-subtle)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--cobalt)] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-[var(--charcoal-subtle)]">
                Analyzing document... {uploadProgress}%
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Parsed Resume Confirmation Card */
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--cobalt-light)] text-[var(--cobalt)] flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--charcoal)]">
                    {resumeData.fileName}
                  </h4>
                  <Badge variant="success" dot>
                    Extracted & Ready for Review
                  </Badge>
                </div>
                <p className="text-xs text-[var(--charcoal-muted)]">
                  {Math.round(resumeData.fileSizeBytes / 1024)} KB •{" "}
                  {resumeData.skillsDetected.length} competencies detected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Different File
              </Button>
            </div>
          </div>

          {/* Extracted Skills Preview & Separate Review Step */}
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--charcoal)] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[var(--cobalt)]" />
                <span>Detected Technical Entities in Resume</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--charcoal-subtle)]">
                Separated from manual entries
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {resumeData.skillsDetected.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-white text-[var(--charcoal)] border border-[var(--border)] text-xs font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>

            {onApplyExtractedSkills && (
              <div className="pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="subtle"
                  onClick={() => onApplyExtractedSkills(resumeData.skillsDetected)}
                >
                  Import All Detected Skills into Active Profile
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
