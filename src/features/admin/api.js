import { apiClient } from '../../lib/apiClient.js';

export const adminApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // ─── USERS ───
    listAdminUsers: b.query({
      query: () => '/admin/users',
      providesTags: ['AdminUser'],
    }),

    createManagedUser: b.mutation({
      query: (body) => ({
        url: '/admin/users',
        method: 'POST',
        body: {
          email: body.email,
          password: body.password,
        },
      }),
      invalidatesTags: ['AdminUser'],
    }),

    // ─── PENDING POSTS ───
    listAdminPending: b.query({
      query: () => '/admin/pending',
      providesTags: ['AdminPost'],
    }),

    adminApprovePost: b.mutation({
      query: (postId) => ({
        url: `/admin/posts/${postId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminPost', 'Post'],
    }),

    adminRejectPost: b.mutation({
      query: ({ postId, reason }) => ({
        url: `/admin/posts/${postId}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['AdminPost', 'Post'],
    }),
  }),
});

export const {
  useListAdminUsersQuery,
  useCreateManagedUserMutation,
  useListAdminPendingQuery,
  useAdminApprovePostMutation,
  useAdminRejectPostMutation,
} = adminApi;