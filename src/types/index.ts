export type User = {
  email: string;
  nickname: string;
  password?: string;
  birthday?: string; // YYYY-MM-DD
};

export type DailyGoal = {
  id: string;
  text: string;
  done: boolean;
};

export type DayEntry = {
  date: string; // YYYY-MM-DD
  note: string;
  image?: string; // Base64 data URL (deprecated)
  images?: string[];
  dailyGoals?: DailyGoal[];
  gratitude?: string[];
};

export type Campaign = {
  id: string;
  title: string;
  description: string;
  image?: string;
  friends: string[];
};
