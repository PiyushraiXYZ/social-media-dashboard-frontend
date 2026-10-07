import { apiClient } from '../../lib/apiClient.js';

export const workspaceApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // ─── ANALYTICS ───
    getAnalytics: b.query({
      query: () => '/analytics',
      providesTags: ['Analytics'],
    }),

    // ─── RECENT POSTS ───
    getRecentPosts: b.query({
      query: () => '/posts/',
      providesTags: ['Post'],
    }),

    // ─── UPCOMING ───
    getUpcomingPosts: b.query({
      query: () => '/posts/upcoming',
      providesTags: ['Post'],
    }),

    // ⭐ AI GENERATION — Trigger bulk AI post generation
    triggerAiGeneration: b.mutation({
      query: () => ({
        url: '/ai/generate',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetRecentPostsQuery,
  useGetUpcomingPostsQuery,
  useTriggerAiGenerationMutation,
} = workspaceApi;