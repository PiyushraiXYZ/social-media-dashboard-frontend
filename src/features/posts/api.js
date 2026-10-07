import { apiClient } from '../../lib/apiClient.js';

export const postsApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    listPosts: b.query({ query: () => '/posts', providesTags: ['Post'] }),
    getPost: b.query({ query: (id) => `/posts/${id}`, providesTags: ['Post'] }),
    createPost: b.mutation({ query: (body) => ({ url: '/posts', method: 'POST', body }), invalidatesTags: ['Post'] }),
    generatePost: b.mutation({ query: (body) => ({ url: '/posts/generate', method: 'POST', body }) }),
    updatePost: b.mutation({ query: ({ id, ...body }) => ({ url: `/posts/${id}`, method: 'PATCH', body }), invalidatesTags: ['Post'] }),
    retryGeneration: b.mutation({ query: ({ id, stage }) => ({ url: `/posts/${id}/retry/${stage}`, method: 'POST' }) }),
  }),
});

export const {
  useListPostsQuery, useGetPostQuery, useCreatePostMutation,
  useGeneratePostMutation, useUpdatePostMutation, useRetryGenerationMutation,
} = postsApi;
