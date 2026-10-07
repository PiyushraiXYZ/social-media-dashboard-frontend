import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'brand',
  initialState: {
    profile: { name: 'Northstar Learning', email: 'maya@northstar.example' },
    logoUrl: null,
    footerUrl: null,
    uploadStatus: 'idle',
  },
  reducers: {
    setProfile(state, a) { state.profile = { ...state.profile, ...a.payload }; },
    setLogoUrl(state, a) { state.logoUrl = a.payload; },
    setFooterUrl(state, a) { state.footerUrl = a.payload; },
    setUploadStatus(state, a) { state.uploadStatus = a.payload; },
  },
});

export const { setProfile, setLogoUrl, setFooterUrl, setUploadStatus } = slice.actions;
export default slice.reducer;
