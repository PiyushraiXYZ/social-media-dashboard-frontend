import { apiClient } from '../../lib/apiClient.js';

export const accountsApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // ─── USER-SCOPED (legacy, kept for compatibility) ───
    getPlatformStatus: b.query({
      query: () => '/platforms/status',
      providesTags: ['Account'],
    }),

    getPlatformAccounts: b.query({
      query: () => '/platforms/accounts',
      providesTags: ['Account'],
    }),

    // ⭐ BRAND-SCOPED ACCOUNTS
    // Returns only accounts belonging to the specified brand.
    // Response shape:
    //   {
    //     brand_id: 2,
    //     accounts: {
    //       facebook: [{ id, connected, page_id, name, followers }],
    //       instagram: [...],
    //       linkedin: [...]
    //     }
    //   }
    getBrandSocialAccounts: b.query({
      query: (brandId) => `/platforms/brands/${brandId}/accounts`,
      providesTags: (result, error, brandId) => [
        { type: 'Account', id: `brand-${brandId}` },
      ],
    }),

    // ─── OAUTH CONNECT ───
    // If brandId provided → brand-scoped OAuth
    // Otherwise → user-scoped (legacy fallback)
    connectFacebook: b.query({
      query: ({ brandId = null, force = false } = {}) => {
        const forceParam = force ? '?force=true' : '';

        if (brandId) {
          return `/auth/facebook/brands/${brandId}/connect${forceParam}`;
        }
        return `/auth/facebook/connect${forceParam}`;
      },
    }),

    connectLinkedIn: b.query({
      query: ({ brandId = null } = {}) => {
        if (brandId) {
          return `/auth/linkedin/brands/${brandId}/connect`;
        }
        return `/auth/linkedin/connect`;
      },
    }),
  }),
});

export const {
  useGetPlatformStatusQuery,
  useGetPlatformAccountsQuery,
  useGetBrandSocialAccountsQuery,        // ⭐ NEW
  useLazyConnectFacebookQuery,
  useLazyConnectLinkedInQuery,
} = accountsApi;