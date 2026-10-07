import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'users', // users | pending
};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = slice.actions;
export default slice.reducer;