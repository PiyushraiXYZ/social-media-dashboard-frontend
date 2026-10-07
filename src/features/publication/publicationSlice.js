import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'publication',
  initialState: {
    jobs: [],
    status: 'idle', // idle | publishing | partial | success | failed
  },
  reducers: {
    setJobs(state, a) { state.jobs = a.payload; },
    setStatus(state, a) { state.status = a.payload; },
    updateJob(state, a) {
      const i = state.jobs.findIndex((j) => j.id === a.payload.id);
      if (i >= 0) state.jobs[i] = { ...state.jobs[i], ...a.payload };
    },
  },
});

export const { setJobs, setStatus, updateJob } = slice.actions;
export default slice.reducer;
