export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: "added" | "improved" | "fixed";
    description: string;
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.9.4",
    date: "January 2026",
    changes: [
      { type: "added", description: "Admin dashboard with Pro gifting" },
      { type: "fixed", description: "Category sync bug causing categories to disappear" },
      { type: "improved", description: "Contact cards no longer show email unnecessarily" },
    ],
  },
  {
    version: "0.9.3",
    date: "January 2026",
    changes: [
      { type: "added", description: "Centralized hint system with spotlight" },
      { type: "improved", description: "Onboarding flow for new users" },
      { type: "fixed", description: "Various UI polish and bug fixes" },
    ],
  },
  {
    version: "0.9.2",
    date: "January 2026",
    changes: [
      { type: "added", description: "Family sharing with invitations" },
      { type: "added", description: "Shared calendar views" },
      { type: "improved", description: "Performance improvements for large calendars" },
    ],
  },
  {
    version: "0.9.1",
    date: "December 2025",
    changes: [
      { type: "added", description: "Relationship management feature" },
      { type: "added", description: "Contact tracking and reminders" },
      { type: "improved", description: "Backlog schedule panel with month accordion" },
    ],
  },
  {
    version: "0.9.0",
    date: "December 2025",
    changes: [
      { type: "added", description: "Gamification system with XP and achievements" },
      { type: "added", description: "Exercise logging with rest timer" },
      { type: "added", description: "Habit tracking with streaks" },
      { type: "improved", description: "Backlog item completion workflow" },
    ],
  },
  {
    version: "0.8.0",
    date: "November 2025",
    changes: [
      { type: "added", description: "Backlog feature for books, games, movies, TV shows" },
      { type: "added", description: "Auto time estimates from TMDB, RAWG, OpenLibrary" },
      { type: "added", description: "Monthly capacity planning" },
    ],
  },
  {
    version: "0.7.0",
    date: "October 2025",
    changes: [
      { type: "added", description: "Google Calendar sync (one-way, experimental)" },
      { type: "added", description: "Pro subscription via Stripe" },
      { type: "improved", description: "Calendar grid performance" },
    ],
  },
  {
    version: "0.6.0",
    date: "September 2025",
    changes: [
      { type: "added", description: "Infinite calendar grid" },
      { type: "added", description: "Category system with colors" },
      { type: "added", description: "Dark mode support" },
    ],
  },
];
