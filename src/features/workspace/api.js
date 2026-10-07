import { apiClient } from '../../lib/apiClient.js';

export const workspaceApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    getWorkspace: b.query({ query: () => '/workspace', providesTags: ['Workspace'] }),
    getRecentPosts: b.query({ query: () => '/workspace/recent-posts', providesTags: ['Post'] }),
  }),
});

export const { useGetWorkspaceQuery, useGetRecentPostsQuery } = workspaceApi;
