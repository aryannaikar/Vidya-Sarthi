"use client";

import React, { useState, useRef } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { MatchedOpportunity } from "@/types/matching";
import { matchingService } from "@/lib/api/matchingService";
import {
  Send,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
  ArrowUpRight,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  matches?: MatchedOpportunity[];
  recommendedSkills?: string[];
  followUps?: string[];
}

export default function CareerAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageIdRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Hello Aarav! I am your AI Career Assistant, grounded strictly in your verified coursework in Computer Science, your resume analysis, and active requisitions in our opportunity pool. How can I help guide your opportunity search today?",
      recommendedSkills: ["Kafka", "System Design", "Redis"],
      followUps: [
        "What engineering gaps should I address before applying to Zerodha systems roles?",
        "Generate 3 technical behavioral interview scenarios based on my React & TypeScript projects.",
        "Recommend open-source repositories to contribute to for improving distributed systems skills.",
      ],
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || prompt;
    if (!textToSend.trim() || isLoading) return;

    const nextId = messageIdRef.current++;
    const userMessage: ChatMessage = {
      id: `user-${nextId}`,
      sender: "user",
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await matchingService.queryCareerAssistant(textToSend);
      const assistantId = messageIdRef.current++;
      const assistantMessage: ChatMessage = {
        id: `ai-${assistantId}`,
        sender: "assistant",
        text: response.answer,
        matches: response.relevantMatches,
        recommendedSkills: response.recommendedSkills,
        followUps: response.suggestedFollowUps,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Assistant error:", err);
      const errId = messageIdRef.current++;
      const errorMessage: ChatMessage = {
        id: `ai-err-${errId}`,
        sender: "assistant",
        text: "I encountered an error querying the matching engine. Please verify your connection and try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cobalt" dot monospace>
              COURSEWORK GROUNDED AI
            </Badge>
            <span className="text-xs text-[var(--charcoal-subtle)] font-mono">
              Privacy Preserved
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--charcoal)] tracking-tight">
            AI Career Assistant & Matching Guide
          </h2>
          <p className="text-xs text-[var(--charcoal-muted)] mt-0.5">
            Personalized guidance grounded strictly in your verified coursework, resume, and real market requisitions
          </p>
        </div>

        {/* Privacy First Callout */}
        <div className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--surface-subtle)] border border-[var(--border)] flex items-start gap-3">
          <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--cobalt-subtle)] text-[var(--cobalt)] shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <h4 className="font-semibold text-[var(--charcoal)]">
              Privacy First & Grounded Guidance Policy
            </h4>
            <p className="text-[var(--charcoal-muted)] leading-relaxed">
              Queries are evaluated against verified repository signals and our internal opportunity collection. Data is never sold or used for model retraining.
            </p>
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[var(--cobalt-subtle)] text-[var(--cobalt)] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-[var(--radius-lg)] p-4 space-y-3 ${
                    isUser
                      ? "bg-[var(--cobalt)] text-white"
                      : "bg-[var(--surface-card)] border border-[var(--border)] text-[var(--charcoal)] shadow-[var(--shadow-subtle)]"
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>

                  {/* Grounded Matching Recommendations if attached */}
                  {msg.matches && msg.matches.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-[11px] font-semibold text-[var(--charcoal)] block">
                        Aligned Positions from Active Collection:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.matches.map((m) => (
                          <div
                            key={m.opportunity.id}
                            className="p-2.5 rounded-[var(--radius-md)] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-1.5 font-semibold text-[var(--charcoal)]">
                                <span>{m.opportunity.title}</span>
                                <Badge variant="cobalt" monospace>
                                  {m.relevanceScore}%
                                </Badge>
                              </div>
                              <span className="text-[11px] text-[var(--charcoal-muted)]">
                                {m.opportunity.company} • {m.opportunity.location}
                              </span>
                            </div>
                            <a
                              href={m.opportunity.originalPostingUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Button size="sm" variant="ghost">
                                View <ArrowUpRight className="w-3 h-3 ml-1" />
                              </Button>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Skills */}
                  {msg.recommendedSkills && msg.recommendedSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[11px] text-[var(--charcoal-muted)] mr-1">
                        High Priority:
                      </span>
                      {msg.recommendedSkills.map((s) => (
                        <Badge key={s} variant="warning" monospace>
                          +{s}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[var(--charcoal-subtle)] block">
                        Suggested Follow-Up Questions:
                      </span>
                      <div className="flex flex-col gap-1">
                        {msg.followUps.map((text, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(text)}
                            className="text-left text-xs text-[var(--cobalt)] hover:underline flex items-center justify-between py-1 cursor-pointer"
                          >
                            <span>{text}</span>
                            <ArrowRight className="w-3 h-3 text-[var(--cobalt)] shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[var(--charcoal)] text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[var(--charcoal-muted)] pl-2">
              <Bot className="w-4 h-4 text-[var(--cobalt)] animate-spin" />
              <span>Analyzing profile alignment and active opportunity requisitions...</span>
            </div>
          )}
        </div>

        {/* Chat Input Box */}
        <Card className="p-3 bg-[var(--surface-card)] sticky bottom-4 shadow-[var(--shadow-card)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Ask anything about roles, resumes, skill paths, or interview scenarios..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!prompt.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Analyze
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
