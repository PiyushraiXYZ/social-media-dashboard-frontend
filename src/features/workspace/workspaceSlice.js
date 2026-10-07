import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'workspace',
  initialState: {
    stats: { scheduled: 1, published: 1, failed: 1, awaitingApproval: 1 },
    upcoming: [],
    recentActivity: [],
    recentPosts: [],
    firstUse: false,
  },
  reducers: {
    setStats(state, a) { state.stats = a.payload; },
    setFirstUse(state, a) { state.firstUse = a.payload; },
  },
});

export const { setStats, setFirstUse } = slice.actions;
export const selectWorkspace = (s) => s.workspace;
export default slice.reducer;
