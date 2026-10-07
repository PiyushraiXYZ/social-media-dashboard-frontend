import { apiClient } from '../../lib/apiClient.js';

export const schedulingApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    schedulePost: b.mutation({
      query: (body) => ({ url: '/schedule', method: 'POST', body }),
      invalidatesTags: ['Schedule', 'Post'],
    }),
    listScheduled: b.query({ query: () => '/schedule', providesTags: ['Schedule'] }),
  }),
});

export const { useSchedulePostMutation, useListScheduledQuery } = schedulingApi;
