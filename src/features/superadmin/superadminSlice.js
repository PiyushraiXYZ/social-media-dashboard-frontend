import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'organizations', // organizations | users | posts
};

const slice = createSlice({
  name: 'superadmin',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = slice.actions;
export default slice.reducer;