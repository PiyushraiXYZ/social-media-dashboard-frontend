import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  status: 'idle', // idle | publishing | success | partial | failed
  activePostId: null,
};

const slice = createSlice({
  name: 'publication',
  initialState,
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setActivePost(state, action) {
      state.activePostId = action.payload;
    },
    resetPublication(state) {
      state.jobs = [];
      state.status = 'idle';
      state.activePostId = null;
    },
  },
});

export const {
  setJobs,
  setStatus,
  setActivePost,
  resetPublication,
} = slice.actions;

export default slice.reducer;