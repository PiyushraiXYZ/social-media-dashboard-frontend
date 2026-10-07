import { apiClient } from '../../lib/apiClient.js';

export const approvalApi = apiClient.injectEndpoints({
  endpoints: (b) => ({
    listApprovals: b.query({ query: () => '/approvals', providesTags: ['Approval'] }),
    requestApproval: b.mutation({ query: (body) => ({ url: '/approvals/request', method: 'POST', body }), invalidatesTags: ['Approval'] }),
    approvePost: b.mutation({ query: (id) => ({ url: `/approvals/${id}/approve`, method: 'POST' }), invalidatesTags: ['Approval', 'Post'] }),
    resendConfirmation: b.mutation({ query: (id) => ({ url: `/approvals/${id}/resend`, method: 'POST' }) }),
  }),
});

export const {
  useListApprovalsQuery, useRequestApprovalMutation,
  useApprovePostMutation, useResendConfirmationMutation,
} = approvalApi;
