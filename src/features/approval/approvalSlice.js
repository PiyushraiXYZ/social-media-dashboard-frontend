import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'approval',
  initialState: { pending: [], history: [] },
  reducers: {
    setPending(state, a) { state.pending = a.payload; },
    pushHistory(state, a) { state.history.unshift(a.payload); },
  },
});

export const { setPending, pushHistory } = slice.actions;
export default slice.reducer;
