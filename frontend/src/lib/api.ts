import type { CalendarEvent } from './types';

const API_URL = 'http://localhost:5000';

export const api = {
    async getEvents(): Promise<CalendarEvent[]> {
        try {
            const response = await fetch(`${API_URL}/events`);
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    },

    async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> {
        try {
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
            if (!response.ok) {
                throw new Error('Failed to create event');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating event:', error);
            return null;
        }
    },
};
