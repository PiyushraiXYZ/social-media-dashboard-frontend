import { apiClient } from '../../lib/apiClient.js';

export const superadminApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // ─── ORGANIZATIONS ───
    listOrganizations: b.query({
      query: () => '/superadmin/organizations',
      providesTags: ['Organization'],
    }),

    getOrganizationDetail: b.query({
      query: (adminId) => `/superadmin/organizations/${adminId}`,
      providesTags: (r, e, id) => [{ type: 'Organization', id }],
    }),

    // ─── CREATE ADMIN ───
    createAdminAccount: b.mutation({
      query: (body) => ({
        url: '/superadmin/admins',
        method: 'POST',
        body: {
          email: body.email,
          password: body.password,
          org_name: body.org_name,
          address: body.address || null,
          invite_code: body.invite_code || null,
        },
      }),
      invalidatesTags: ['Organization', 'AdminUser'],
    }),

    // ─── USERS / POSTS ───
    listAllUsers: b.query({
      query: () => '/superadmin/users',
      providesTags: ['AdminUser'],
    }),

    listAllPosts: b.query({
      query: (status) =>
        status
          ? `/superadmin/posts?status=${status}`
          : '/superadmin/posts',
      providesTags: ['Post'],
    }),
  }),
});

export const {
  useListOrganizationsQuery,
  useGetOrganizationDetailQuery,
  useCreateAdminAccountMutation,
  useListAllUsersQuery,
  useListAllPostsQuery,
} = superadminApi;