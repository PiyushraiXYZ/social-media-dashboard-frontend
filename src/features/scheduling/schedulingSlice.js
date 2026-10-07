import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'scheduling',
  initialState: { selectedDate: null, time: '18:30', timezone: 'UTC', scheduledAt: null },
  reducers: {
    setSelectedDate(state, a) { state.selectedDate = a.payload; },
    setTime(state, a) { state.time = a.payload; },
    setTimezone(state, a) { state.timezone = a.payload; },
    setScheduledAt(state, a) { state.scheduledAt = a.payload; },
  },
});

export const { setSelectedDate, setTime, setTimezone, setScheduledAt } = slice.actions;
export default slice.reducer;
