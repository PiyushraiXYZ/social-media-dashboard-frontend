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
    logo_size: 60,
    logo_position_x: 4,
    logo_position_y: 4,
    footer_height: 60,
    footer_width: 100,
    footer_position_x: 0,
    footer_position_y: 0,
    overlay_color: '#ffffff',
  },
  footer_url: '',
  overlay: {
    text: '',
    position: 'bottom-center',
    text_size: 40,
    color: '#ffffff',
  },
  uploadStatus: 'idle',
  appliedTemplate: null,
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
    setAppliedTemplate(state, action) {
      state.appliedTemplate = action.payload;
    },
  },
});

export const {
  setProfile,
  setFooter,
  setOverlay,
  setUploadStatus,
  setAppliedTemplate,
} = slice.actions;

export default slice.reducer;