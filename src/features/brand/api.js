import { apiClient } from '../../lib/apiClient.js';

export const brandApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    getBrand: b.query({ query: () => '/brand', providesTags: ['Brand'] }),
    saveProfile: b.mutation({ query: (body) => ({ url: '/brand/profile', method: 'PUT', body }), invalidatesTags: ['Brand'] }),
    applyBranding: b.mutation({ query: (body) => ({ url: '/brand/apply', method: 'POST', body }) }),
  }),
});

export const { useGetBrandQuery, useSaveProfileMutation, useApplyBrandingMutation } = brandApi;
