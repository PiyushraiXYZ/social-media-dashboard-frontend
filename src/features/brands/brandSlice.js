import { createSlice } from '@reduxjs/toolkit';

const ACTIVE_BRAND_KEY = 'socialdesk_active_brand';

function loadActiveBrand() {
  try {
    const raw = localStorage.getItem(ACTIVE_BRAND_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = {
  brands: [],
  activeBrand: loadActiveBrand(),
};

const slice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrands(state, action) {
      state.brands = action.payload;
    },

    setActiveBrand(state, action) {
      state.activeBrand = action.payload;

      if (action.payload) {
        localStorage.setItem(
          ACTIVE_BRAND_KEY,
          JSON.stringify(action.payload)
        );
      } else {
        localStorage.removeItem(ACTIVE_BRAND_KEY);
      }
    },

    clearBrands(state) {
      state.brands = [];
      state.activeBrand = null;
      localStorage.removeItem(ACTIVE_BRAND_KEY);
    },
  },
});

export const { setBrands, setActiveBrand, clearBrands } = slice.actions;

export const selectActiveBrand = (s) => s.brands.activeBrand;
export const selectBrands = (s) => s.brands.brands;

export default slice.reducer;