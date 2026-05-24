export type EventCategory =
  | "work"
  | "personal"
  | "general"
  | "health"
  | "social";

export type EventPriority = "low" | "medium" | "high";

export interface DayflowEvent {
  userId: string;
  eventId: string;
  title: string;
  datetime: string;
  category: EventCategory;
  notes?: string | null;
  priority?: EventPriority | null;
  location?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface EventCreatePayload {
  title: string;
  datetime: string;
  category: EventCategory;
  notes?: string | null;
  priority?: EventPriority;
  location?: string | null;
}

export interface EventUpdatePayload extends Partial<EventCreatePayload> {
  completed?: boolean;
}

export type TaskPriority = "low" | "medium" | "high";

export interface DayflowTask {
  userId: string;
  taskId: string;
  title: string;
  notes?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority | null;
  completed: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface TaskCreatePayload {
  title: string;
  notes?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
}

export interface TaskUpdatePayload extends Partial<TaskCreatePayload> {
  completed?: boolean;
}

export interface Weather {
  temp: number;
  feels_like?: number | null;
  description: string;
  city: string;
  humidity?: number | null;
  wind_speed?: number | null;
  high?: number | null;
  low?: number | null;
  icon?: string | null;
}

export interface Briefing {
  date: string;
  event_count: number;
  events: DayflowEvent[];
  weather: Weather;
  advice: string;
  greeting: string;
  summary: string;
}

export interface UserPreferences {
  city: string;
  timezone: string;
  notifications_email: boolean;
  notifications_sms: boolean;
  phone?: string | null;
  briefing_time: string;
}

export interface UserProfile {
  sub: string;
  email: string;
  name?: string | null;
  preferences: UserPreferences;
}

export interface AuthTokens {
  token: string;
  access: string;
  refresh: string;
}
