export type HackathonMode = "online" | "in-person" | "hybrid";

export interface Hackathon {
  id: string;
  title: string;
  organizer: string;
  bannerUrl?: string;
  mode: HackathonMode;
  location?: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizePool?: string;
  tags: string[];
  externalUrl: string;
  isRegistered?: boolean;
}
