import { apiClient } from '../../lib/apiClient.js';

export const publicationApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    publishPost: b.mutation({
      query: (body) => ({ url: '/publications', method: 'POST', body }),
      invalidatesTags: ['Publication', 'Post'],
    }),
    getPublication: b.query({ query: (id) => `/publications/${id}`, providesTags: ['Publication'] }),
    retryDestination: b.mutation({
      query: ({ id, destination }) => ({ url: `/publications/${id}/retry/${destination}`, method: 'POST' }),
    }),
  }),
});

export const { usePublishPostMutation, useGetPublicationQuery, useRetryDestinationMutation } = publicationApi;
