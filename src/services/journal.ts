import apiService from './api';
import type { JournalEntry, PaginatedResponse } from '@/types';

export const journalService = {
  async createJournalEntry(entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    const response = await apiService.post<JournalEntry>('/journal/', entryData);
    return response.data;
  },

  async getJournalEntries(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<JournalEntry>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) params.append('search', search);
    
    const response = await apiService.get<PaginatedResponse<JournalEntry>>(`/journal/?${params.toString()}`);
    return response.data;
  },

  async getJournalEntry(id: string): Promise<JournalEntry> {
    const response = await apiService.get<JournalEntry>(`/journal/${id}`);
    return response.data;
  },

  async updateJournalEntry(id: string, entryData: Partial<JournalEntry>): Promise<JournalEntry> {
    const response = await apiService.put<JournalEntry>(`/journal/${id}`, entryData);
    return response.data;
  },

  async deleteJournalEntry(id: string): Promise<void> {
    await apiService.delete(`/journal/${id}`);
  },

  // AI Response
  async regenerateAIResponse(id: string): Promise<JournalEntry> {
    const response = await apiService.post<JournalEntry>(`/journal/${id}/regenerate-ai`);
    return response.data;
  },

  // Search and Filter
  async searchJournalEntries(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<JournalEntry>> {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiService.get<PaginatedResponse<JournalEntry>>(`/journal/search?${params.toString()}`);
    return response.data;
  },

  async getJournalEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });
    
    const response = await apiService.get<JournalEntry[]>(`/journal/by-date-range?${params.toString()}`);
    return response.data;
  },

  // Analytics
  async getJournalStats(): Promise<any> {
    const response = await apiService.get('/journal/stats');
    return response.data;
  },

  async getMoodImpactAnalysis(): Promise<any> {
    const response = await apiService.get('/journal/mood-impact');
    return response.data;
  },

  // Draft functionality
  async saveDraft(content: string, moodBefore: number, moodAfter: number): Promise<void> {
    localStorage.setItem('journal_draft', JSON.stringify({
      content,
      moodBefore,
      moodAfter,
      timestamp: new Date().toISOString()
    }));
  },

  async getDraft(): Promise<{ content: string; moodBefore: number; moodAfter: number; timestamp: string } | null> {
    const draft = localStorage.getItem('journal_draft');
    return draft ? JSON.parse(draft) : null;
  },

  async clearDraft(): Promise<void> {
    localStorage.removeItem('journal_draft');
  }
};
