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
      { type: "fixed", description: "Categories no longer disappear unexpectedly" },
      { type: "improved", description: "Cleaner contact cards in People view" },
    ],
  },
  {
    version: "0.9.3",
    date: "January 2026",
    changes: [
      { type: "added", description: "Helpful hints and tips throughout the app" },
      { type: "improved", description: "Smoother onboarding for new users" },
    ],
  },
  {
    version: "0.9.2",
    date: "January 2026",
    changes: [
      { type: "added", description: "Family sharing with email invitations" },
      { type: "added", description: "Shared calendar views for families and groups" },
      { type: "improved", description: "Faster loading for large calendars" },
    ],
  },
  {
    version: "0.9.1",
    date: "December 2025",
    changes: [
      { type: "added", description: "Relationship management - track when you last contacted people" },
      { type: "added", description: "Contact reminders so you never forget to reach out" },
      { type: "improved", description: "Backlog schedule panel with collapsible months" },
    ],
  },
  {
    version: "0.9.0",
    date: "December 2025",
    changes: [
      { type: "added", description: "XP and achievements for completing backlog items" },
      { type: "added", description: "Exercise logging with sets, reps, and rest timer" },
      { type: "added", description: "Habit tracking with streaks" },
      { type: "improved", description: "Better backlog completion workflow" },
    ],
  },
  {
    version: "0.8.0",
    date: "November 2025",
    changes: [
      { type: "added", description: "Backlog for books, games, movies, and TV shows" },
      { type: "added", description: "Automatic time estimates from TMDB, RAWG, and OpenLibrary" },
      { type: "added", description: "Monthly capacity planning for your backlog" },
    ],
  },
  {
    version: "0.7.0",
    date: "October 2025",
    changes: [
      { type: "added", description: "Google Calendar sync (one-way, experimental)" },
      { type: "added", description: "Pro subscription for power users" },
      { type: "improved", description: "Smoother calendar grid scrolling" },
    ],
  },
  {
    version: "0.6.0",
    date: "September 2025",
    changes: [
      { type: "added", description: "Infinite calendar grid - see your whole year" },
      { type: "added", description: "Color-coded categories" },
      { type: "added", description: "Dark mode" },
    ],
  },
];
