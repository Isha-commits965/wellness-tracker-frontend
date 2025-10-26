import apiService from './api';
import type { JournalEntry, PaginatedResponse } from '@/types';

export const journalService = {
  async createJournalEntry(entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<JournalEntry> {
    // Use Option 1 format (recommended) - only content and mood_before
    const backendPayload = {
      content: entryData.content || '',
      mood_before: entryData.moodBefore || 5
    };
    
    console.log('Sending journal entry payload:', backendPayload);
    console.log('Original entry data:', entryData);
    console.log('Using Option 1 format (no date)');
    
    try {
      const response = await apiService.post<any>('/journal/', backendPayload);
      console.log('Create journal response:', response);
      
      // Map backend response to frontend format
      return {
        id: response.id.toString(),
        content: response.content,
        moodBefore: response.mood_before,
        moodAfter: response.mood_after || response.mood_before, // Use mood_before as fallback
        date: response.date,
        aiResponse: response.ai_response,
        suggestions: response.suggestions || [],
        userId: response.user_id?.toString() || '',
        createdAt: response.created_at,
        updatedAt: response.updated_at || response.created_at
      };
    } catch (error: any) {
      console.error('Journal creation error details:', error.response?.data);
      console.error('Request payload that failed:', backendPayload);
      throw error;
    }
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
    // Map frontend camelCase to backend snake_case
    const backendPayload: any = {};
    if (entryData.content !== undefined) backendPayload.content = entryData.content;
    if (entryData.moodBefore !== undefined) backendPayload.mood_before = entryData.moodBefore;
    if (entryData.moodAfter !== undefined) backendPayload.mood_after = entryData.moodAfter;
    if (entryData.date !== undefined) backendPayload.date = entryData.date;
    
    const response = await apiService.put<any>(`/journal/${id}`, backendPayload);
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

  // AI Conversation (using regenerate-ai endpoint to create conversational experience)
  async sendConversationMessage(entryId: string, message: string): Promise<{ ai_response: string; suggestions: string[] }> {
    console.log('Starting conversation for entry:', entryId, 'with message:', message);
    
    try {
      // Get the current journal entry
      console.log('Getting current journal entry...');
      const currentEntry = await this.getJournalEntry(entryId);
      console.log('Current entry:', currentEntry);
      
      // Create conversation context by appending the user's message
      const conversationContext = currentEntry.content + `\n\n[User Question: ${message}]`;
      console.log('Updated content:', conversationContext);
      
      // Update the journal entry with the conversation context
      console.log('Updating journal entry...');
      await this.updateJournalEntry(entryId, { content: conversationContext });
      
      // Regenerate AI response with the new context
      console.log('Regenerating AI response...');
      const regeneratedEntry = await this.regenerateAIResponse(entryId);
      console.log('Regenerated entry:', regeneratedEntry);
      
      return {
        ai_response: regeneratedEntry.aiResponse || `Thank you for your question: "${message}". I understand you're looking for guidance. Based on your journal entry, I'd suggest reflecting on the patterns you've noticed and considering what steps might help you move forward.`,
        suggestions: regeneratedEntry.suggestions || [
          "Take a moment to reflect on your feelings",
          "Consider what you've learned from this experience", 
          "Think about what you'd like to change or improve"
        ]
      };
    } catch (error: any) {
      console.error('Error in conversation:', error);
      
      // For now, let's use a simple fallback without modifying the journal entry
      console.log('Using fallback response due to error');
      
      // Fallback to client-side responses if API fails
      const responses = [
        `I hear you asking about "${message}". That's a thoughtful question. Based on your journal entry, it seems like you're processing some important feelings. What stands out to you most about this situation?`,
        `Thank you for sharing that with me. When you mention "${message}", I sense there might be deeper feelings underneath. How does this connect to what you wrote in your journal?`,
        `That's an interesting perspective on "${message}". I can see how this relates to your journal entry. What would you like to explore further about this?`,
        `I understand you're curious about "${message}". Your journal entry shows a lot of self-reflection. What patterns do you notice in your thoughts and feelings?`,
        `Thank you for being open about "${message}". Based on what you've written, it seems like you're going through a meaningful process. What would feel most helpful to you right now?`
      ];
      
      const suggestions = [
        "Reflect on what this situation teaches you about yourself",
        "Consider what you need most right now",
        "Think about one small step you could take",
        "Notice any patterns in your thoughts and feelings",
        "Ask yourself what you're grateful for in this moment"
      ];
      
      // Get a random response
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const randomSuggestions = suggestions.slice(0, 3);
      
      return {
        ai_response: randomResponse,
        suggestions: randomSuggestions
      };
    }
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
