export interface RoadmapItem {
  title: string;
  description: string;
  status: "shipped" | "in-progress" | "planned" | "considering";
}

export const roadmap: RoadmapItem[] = [
  // Shipped
  {
    title: "Infinite Calendar Grid",
    description: "See months and years at a glance, plan in days not hours",
    status: "shipped",
  },
  {
    title: "Backlog Tracking",
    description: "Books, games, movies, TV shows with auto time estimates",
    status: "shipped",
  },
  {
    title: "Family Sharing",
    description: "Shared calendars for families and friend groups",
    status: "shipped",
  },
  {
    title: "Habit Tracking",
    description: "Daily/weekly habits with streak tracking",
    status: "shipped",
  },
  {
    title: "Exercise Logging",
    description: "Log workouts, track PRs, rest timer",
    status: "shipped",
  },
  {
    title: "Relationship Management",
    description: "Track contacts and when you last reached out",
    status: "shipped",
  },

  // In Progress
  {
    title: "Alpha Testing",
    description: "Gathering feedback from early users",
    status: "in-progress",
  },

  // Planned
  {
    title: "Mobile Apps",
    description: "Native iOS and Android apps",
    status: "planned",
  },
  {
    title: "Gift Lists",
    description: "Track gift ideas for friends and family",
    status: "planned",
  },
  {
    title: "Push Notifications",
    description: "Reminders and alerts on mobile",
    status: "planned",
  },

  // Considering
  {
    title: "Subscription Tracker",
    description: "Track recurring subscriptions and payments",
    status: "considering",
  },
  {
    title: "AI Voice Assistant",
    description: "Natural language commands for calendar",
    status: "considering",
  },
];
