import { apiClient } from '../../lib/apiClient.js';

export const aiApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // Chat with AI (RAG query)
    ragQuery: b.mutation({
      query: (query) => ({
        url: '/ai/rag',
        method: 'POST',
        body: { query },
      }),
    }),

    // Clear chat history
    clearRagHistory: b.mutation({
      query: () => ({
        url: '/ai/rag/history',
        method: 'DELETE',
      }),
    }),

    // Bulk AI generation (optional)
    triggerAiGeneration: b.mutation({
      query: () => ({
        url: '/ai/generate',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRagQueryMutation,
  useClearRagHistoryMutation,
  useTriggerAiGenerationMutation,
} = aiApi;