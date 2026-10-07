import { apiClient } from '../../lib/apiClient.js';

export const publicationApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // ─── PUBLISH ───
    publishPost: b.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),

    // ─── RETRY ───
    retryPost: b.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/retry`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  usePublishPostMutation,
  useRetryPostMutation,
} = publicationApi;