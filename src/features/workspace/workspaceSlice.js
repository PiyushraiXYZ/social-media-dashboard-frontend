import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    total: 0,
    posted: 0,
    scheduled: 0,
    failed: 0,
    awaiting_hr_approval: 0,
    awaiting_admin_approval: 0,
    expired: 0,
    cancelled: 0,
    skipped: 0,
  },
  platforms: {
    facebook: 0,
    instagram: 0,
    linkedin: 0,
  },
  successRate: 0,
  recentPosts: [],
  upcomingPosts: [],
};

const slice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setStats(state, action) {
      state.stats = { ...state.stats, ...action.payload };
    },
    setPlatforms(state, action) {
      state.platforms = { ...state.platforms, ...action.payload };
    },
    setSuccessRate(state, action) {
      state.successRate = action.payload;
    },
    setRecentPosts(state, action) {
      state.recentPosts = action.payload;
    },
    setUpcomingPosts(state, action) {
      state.upcomingPosts = action.payload;
    },
  },
});

export const {
  setStats,
  setPlatforms,
  setSuccessRate,
  setRecentPosts,
  setUpcomingPosts,
} = slice.actions;

export const selectWorkspace = (s) => s.workspace;
export default slice.reducer;