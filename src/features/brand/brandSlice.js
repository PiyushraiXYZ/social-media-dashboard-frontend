import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    persona: '',
    industry: '',
    brand_name: '',
    logo_url: '',
    tone: '',
    audience: '',
    country_code: '',
    language: '',
    posts_per_week: 3,
  },
  footer_url: '',
  overlay: {
    text: '',
    position: 'bottom-center',
    text_size: 40,
  },
  uploadStatus: 'idle', // idle | uploading | success | failed
};

const slice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    setFooter(state, action) {
      state.footer_url = action.payload;
    },
    setOverlay(state, action) {
      state.overlay = { ...state.overlay, ...action.payload };
    },
    setUploadStatus(state, action) {
      state.uploadStatus = action.payload;
    },
  },
});

export const {
  setProfile,
  setFooter,
  setOverlay,
  setUploadStatus,
} = slice.actions;

export default slice.reducer;