import apiService from './api';
import type { JournalEntry, PaginatedResponse } from '@/types';

export const journalService = {
      async createJournalEntry(entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
        // Map frontend camelCase to backend snake_case
        const backendPayload = {
          content: entryData.content,
          mood_before: entryData.moodBefore,
          mood_after: entryData.moodAfter,
          date: entryData.date
        };
        
        const response = await apiService.post<any>('/journal/', backendPayload);
        console.log('Create journal response:', response);
        
        // The response is already the data, not wrapped in .data
        return {
          id: response.id,
          content: response.content,
          moodBefore: response.mood_before,
          moodAfter: response.mood_after,
          date: response.date,
          aiResponse: response.ai_response,
          suggestions: response.suggestions || [],
          userId: response.user_id,
          createdAt: response.created_at,
          updatedAt: response.updated_at
        };
      },

  async getJournalEntries(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<JournalEntry>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) params.append('search', search);
    
    const response = await apiService.get<any>(`/journal/?${params.toString()}`);
    console.log('Raw journal entries response:', response);
    
        // The response might be an array or a paginated response
        if (Array.isArray(response)) {
          // Map the array
          const mappedEntries = response.map((entry: any) => ({
            id: entry.id,
            content: entry.content,
            moodBefore: entry.mood_before,
            moodAfter: entry.mood_after,
            date: entry.date,
            aiResponse: entry.ai_response,
            suggestions: entry.suggestions || [],
            userId: entry.user_id,
            createdAt: entry.created_at,
            updatedAt: entry.updated_at
          }));
          console.log('Mapped journal entries:', mappedEntries);
          return {
            data: mappedEntries,
            total: mappedEntries.length,
            page: 1,
            limit: mappedEntries.length,
            totalPages: 1
          };
        } else {
          // It's a paginated response - map the items
          const mappedItems = response.data?.map((entry: any) => ({
            id: entry.id,
            content: entry.content,
            moodBefore: entry.mood_before,
            moodAfter: entry.mood_after,
            date: entry.date,
            aiResponse: entry.ai_response,
            suggestions: entry.suggestions || [],
            userId: entry.user_id,
            createdAt: entry.created_at,
            updatedAt: entry.updated_at
          })) || [];
          
          return {
            data: mappedItems,
            total: response.total || 0,
            page: response.page || 1,
            limit: response.limit || 10,
            totalPages: response.totalPages || 1
          };
        }
  },

  async getJournalEntry(id: string): Promise<JournalEntry> {
    const response = await apiService.get<any>(`/journal/${id}`);
    // The response is already the data, not wrapped in .data
    return {
      id: response.id,
      content: response.content,
      moodBefore: response.mood_before,
      moodAfter: response.mood_after,
      date: response.date,
      aiResponse: response.ai_response,
      suggestions: response.suggestions || [],
      userId: response.user_id,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
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
        const response = await apiService.post<any>(`/journal/${id}/regenerate-ai`);
        // The response is already the data, not wrapped in .data
        return {
          id: response.id,
          content: response.content,
          moodBefore: response.mood_before,
          moodAfter: response.mood_after,
          date: response.date,
          aiResponse: response.ai_response,
          suggestions: response.suggestions || [],
          userId: response.user_id,
          createdAt: response.created_at,
          updatedAt: response.updated_at
        };
      },

      // AI Conversation
      async sendConversationMessage(entryId: string, message: string): Promise<{ ai_response: string; suggestions: string[] }> {
        const response = await apiService.post<any>(`/journal/${entryId}/conversation`, {
          message: message
        });
        // The response is already the data, not wrapped in .data
        return {
          ai_response: response.ai_response,
          suggestions: response.suggestions || []
        };
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
