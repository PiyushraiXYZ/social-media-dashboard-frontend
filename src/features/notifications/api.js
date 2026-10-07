import { apiClient } from '../../lib/apiClient.js';

export const notificationsApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    listNotifications: b.query({ query: () => '/notifications', providesTags: ['Notification'] }),
    markAllRead: b.mutation({ query: () => ({ url: '/notifications/read', method: 'POST' }), invalidatesTags: ['Notification'] }),
  }),
});

export const { useListNotificationsQuery, useMarkAllReadMutation } = notificationsApi;
