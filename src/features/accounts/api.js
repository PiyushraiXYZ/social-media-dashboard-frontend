import { apiClient } from '../../lib/apiClient.js';

export const accountsApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // Quick status — { facebook: "connected"|"not connected", ... }
    getPlatformStatus: b.query({
      query: () => '/platforms/status',
      providesTags: ['Account'],
    }),

    // Full account info — name, followers, etc.
    getPlatformAccounts: b.query({
      query: () => '/platforms/accounts',
      providesTags: ['Account'],
    }),

    // ⭐ Facebook OAuth — supports ?force=true for re-authorization
    // Instagram uses this SAME endpoint with force=true
    // because Instagram is managed through Meta.
    connectFacebook: b.query({
      query: (opts = {}) => {
        const force = opts.force ? '?force=true' : '';
        return `/auth/facebook/connect${force}`;
      },
    }),

    // LinkedIn OAuth
    connectLinkedIn: b.query({
      query: () => '/auth/linkedin/connect',
    }),
  }),
});

export const {
  useGetPlatformStatusQuery,
  useGetPlatformAccountsQuery,
  useLazyConnectFacebookQuery,
  useLazyConnectLinkedInQuery,
} = accountsApi;