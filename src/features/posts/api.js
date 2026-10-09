import { apiClient } from '../../lib/apiClient.js';

export const postsApi = apiClient.injectEndpoints({
  endpoints: (b) => ({

    // ─────────────────────────────────────────────
    // LIST + DETAILS
    // ─────────────────────────────────────────────

    listPosts: b.query({
      query: (status) =>
        status
          ? `/posts/?status=${status}`
          : '/posts/',
      providesTags: ['Post'],
    }),

    upcomingPosts: b.query({
      query: () => '/posts/upcoming',
      providesTags: ['Post'],
    }),

    getPost: b.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [
        {
          type: 'Post',
          id,
        },
      ],
    }),

    // ─────────────────────────────────────────────
    // CRUD
    // ─────────────────────────────────────────────

    createPost: b.mutation({
      query: (body) => ({
        url: '/posts/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'],
    }),

    updatePost: b.mutation({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Post'],
    }),

    deletePost: b.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),

    // ─────────────────────────────────────────────
    // LIFECYCLE ACTIONS
    // ─────────────────────────────────────────────

    publishNow: b.mutation({
      query: (id) => ({
        url: `/posts/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),

    skipPost: b.mutation({
      query: (id) => ({
        url: `/posts/${id}/skip`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Post'],
    }),

    retryPost: b.mutation({
      query: (id) => ({
        url: `/posts/${id}/retry`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Post'],
    }),

    // ─────────────────────────────────────────────
    // AI GENERATION
    // ─────────────────────────────────────────────

    generatePost: b.mutation({
      query: (body) => ({
        url: '/posts/generate',
        method: 'POST',

        body: {
          title: body.title,

          // IMPORTANT:
          // Backend expects "platforms", not "platform"
          platforms: body.platforms,

          generate_image: Boolean(
            body.generate_image
          ),

          scheduled_at:
            body.scheduled_at,
        },
      }),
    }),

    getGenerateStatus: b.query({
      query: (taskId) =>
        `/posts/generate/status/${taskId}`,
    }),

    // ─────────────────────────────────────────────
    // UPLOAD USER MEDIA
    // ─────────────────────────────────────────────

    uploadPostMedia: b.mutation({
      query: (file) => {
        const formData = new FormData();

        formData.append(
          'file',
          file
        );

        return {
          url: '/media/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // ─────────────────────────────────────────────
    // REPOST / PREVIEW
    // ─────────────────────────────────────────────

    repost: b.mutation({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}/repost`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Post'],
    }),

    previewPost: b.query({
      query: (id) =>
        `/posts/${id}/preview`,
    }),

    // ─────────────────────────────────────────────
    // TEMPLATE PAUSE / RESUME
    // ─────────────────────────────────────────────

    pauseTemplate: b.mutation({
      query: (templateId) => ({
        url: `/templates/${templateId}/pause`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Post'],
    }),

    resumeTemplate: b.mutation({
      query: (templateId) => ({
        url: `/templates/${templateId}/resume`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

// ─────────────────────────────────────────────
// EXPORT HOOKS
// ─────────────────────────────────────────────

export const {
  useListPostsQuery,
  useUpcomingPostsQuery,
  useGetPostQuery,

  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,

  usePublishNowMutation,
  useSkipPostMutation,
  useRetryPostMutation,

  useGeneratePostMutation,
  useGetGenerateStatusQuery,
  useLazyGetGenerateStatusQuery,

  useUploadPostMediaMutation,

  useRepostMutation,
  usePreviewPostQuery,

  usePauseTemplateMutation,
  useResumeTemplateMutation,
} = postsApi;