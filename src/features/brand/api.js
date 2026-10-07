import { apiClient } from '../../lib/apiClient.js';

export const brandApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    // ─── PROFILE ───
    getProfile: b.query({
      query: () => '/user/profile',
      providesTags: ['Brand'],
    }),

    saveProfile: b.mutation({
      query: (body) => ({
        url: '/user/profile',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Brand'],
    }),

    // ─── LOGO / FOOTER UPLOAD ───
    // These use dedicated /user/profile/logo and /user/profile/footer endpoints
    uploadLogo: b.mutation({
      query: (file) => {
        const fd = new FormData();
        fd.append('file', file);
        return {
          url: '/user/profile/logo',
          method: 'PUT',
          body: fd,
        };
      },
      invalidatesTags: ['Brand'],
    }),

    uploadFooter: b.mutation({
      query: (file) => {
        const fd = new FormData();
        fd.append('file', file);
        return {
          url: '/user/profile/footer',
          method: 'PUT',
          body: fd,
        };
      },
      invalidatesTags: ['Brand'],
    }),

    // ⭐ GENERIC MEDIA UPLOAD
    // Use this for post media (images/videos)
    uploadMedia: b.mutation({
      query: (file) => {
        const fd = new FormData();
        fd.append('file', file);
        return {
          url: '/media/upload',
          method: 'POST',
          body: fd,
        };
      },
    }),

    // ─── OVERLAY ───
    updateOverlay: b.mutation({
      query: (body) => ({
        url: '/media/user/profile/overlay',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useSaveProfileMutation,
  useUploadLogoMutation,
  useUploadFooterMutation,
  useUploadMediaMutation,      // ⭐ NEW
  useUpdateOverlayMutation,
} = brandApi;