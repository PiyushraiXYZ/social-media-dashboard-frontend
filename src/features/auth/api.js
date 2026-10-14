import { apiClient } from '../../lib/apiClient.js';

export const authApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: body.email,
          password: body.password,
        },
      }),
    }),

    register: b.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          email: body.email,
          password: body.password,
          role: body.role || 'superadmin',        // ⭐ Default superadmin
          timezone: body.timezone || 'UTC',       // ⭐ Add timezone
          invite_code: body.inviteCode || undefined,
          admin_email: body.adminEmail || undefined,
        },
      }),
    }),

    getMe: b.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;