import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'notifications',
  initialState: {
    list: [
      { id: 1, title: 'LinkedIn destination needs attention', body: 'Partial-success branch. Meta destinations published; LinkedIn needs permission validation.', at: '2026-10-06T10:16:00Z', kind: 'Failure', unread: true },
      { id: 2, title: 'Your Meta destinations published', body: 'Facebook and Instagram publication succeeded.', at: '2026-10-06T10:16:00Z', kind: 'Success', unread: true },
      { id: 3, title: 'Approval confirmed', body: 'AI and Machine Learning is Approved.', at: '2026-10-06T10:00:00Z', kind: 'Approval', unread: true },
      { id: 4, title: 'Confirmation email requested', body: 'A review email for post 123 was requested.', at: '2026-10-06T09:30:00Z', kind: 'Email', unread: false },
      { id: 5, title: 'Facebook Page needs reconnection', body: 'Northstar Alumni authorization has expired.', at: '2026-10-06T09:00:00Z', kind: 'Account', unread: false },
    ],
    unreadCount: 3,
  },
  reducers: {
    markAllRead(state) { state.list.forEach((n) => { n.unread = false; }); state.unreadCount = 0; },
  },
});

export const { markAllRead } = slice.actions;
export default slice.reducer;
