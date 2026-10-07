import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {
    facebook: { id: 'facebook', platform: 'facebook', label: 'Northstar Learning', handle: 'fb_page_northstar', status: 'ready', connected: true },
    instagram: { id: 'instagram', platform: 'instagram', label: '@northstar.learning', handle: 'ig_northstar', status: 'ready', connected: true },
    linkedin: { id: 'linkedin', platform: 'linkedin', label: 'Maya Chen', handle: 'member', status: 'validation_pending', connected: false },
  },
  order: ['facebook', 'instagram', 'linkedin'],
};

const slice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    updateAccount(state, a) { state.byId[a.payload.id] = { ...state.byId[a.payload.id], ...a.payload }; },
  },
});

export const { updateAccount } = slice.actions;
export default slice.reducer;
