import { apiClient } from '../../lib/apiClient.js';

export const accountsApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    listAccounts: b.query({ query: () => '/accounts', providesTags: ['Account'] }),
    discoverPages: b.query({ query: () => '/accounts/facebook/pages', providesTags: ['Account'] }),
    discoverInstagram: b.query({ query: () => '/accounts/instagram/accounts', providesTags: ['Account'] }),
    connectFacebookPage: b.mutation({ query: (body) => ({ url: '/accounts/facebook/connect', method: 'POST', body }), invalidatesTags: ['Account'] }),
    connectInstagram: b.mutation({ query: (body) => ({ url: '/accounts/instagram/connect', method: 'POST', body }), invalidatesTags: ['Account'] }),
    connectLinkedIn: b.mutation({ query: () => ({ url: '/accounts/linkedin/connect', method: 'POST' }), invalidatesTags: ['Account'] }),
  }),
});

export const {
  useListAccountsQuery,
  useDiscoverPagesQuery,
  useDiscoverInstagramQuery,
  useConnectFacebookPageMutation,
  useConnectInstagramMutation,
  useConnectLinkedInMutation,
} = accountsApi;
