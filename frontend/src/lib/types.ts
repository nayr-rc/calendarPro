export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO format
}

export type ViewMode = 'month' | 'week';
