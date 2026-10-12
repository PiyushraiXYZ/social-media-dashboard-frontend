import { apiClient } from '../../lib/apiClient.js';

export const brandsApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // ─── LIST ───
    listBrands: b.query({
      query: () => '/brands/',
      providesTags: ['Brand'],
    }),

    // ─── GET SINGLE ───
    getBrand: b.query({
      query: (brandId) => `/brands/${brandId}`,
      providesTags: (r, e, id) => [{ type: 'Brand', id }],
    }),

    // ─── CREATE ───
    createBrand: b.mutation({
      query: (body) => ({
        url: '/brands/',
        method: 'POST',
        body: {
          name: body.name,
          description: body.description || null,
          logo_url: body.logo_url || null,
        },
      }),
      invalidatesTags: ['Brand'],
    }),

    // ─── SET DEFAULT ───
    setDefaultBrand: b.mutation({
      query: (brandId) => ({
        url: `/brands/${brandId}/set-default`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Brand'],
    }),

    // ─── SWITCH ───
    switchBrand: b.mutation({
      query: (brandId) => ({
        url: `/brands/${brandId}/switch`,
        method: 'POST',
      }),
      invalidatesTags: ['Brand'],
    }),

    // ─── WORKSPACE ───
    getBrandWorkspace: b.query({
      query: (brandId) => `/brands/${brandId}/workspace`,
      providesTags: (r, e, id) => [{ type: 'Brand', id }],
    }),
  }),
});

export const {
  useListBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useSetDefaultBrandMutation,
  useSwitchBrandMutation,
  useGetBrandWorkspaceQuery,
} = brandsApi;