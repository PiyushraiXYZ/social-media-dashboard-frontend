import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  activeId: null,
  generation: {
    status: 'idle', // idle | queued | running | generated | failed
    taskId: null,
    stages: [],
    request: null,
    result: null,
    error: null,
  },
};

const slice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setActive(state, action) {
      state.activeId = action.payload;
    },

    setGeneration(state, action) {
      state.generation = { ...state.generation, ...action.payload };
    },

    resetGeneration(state) {
      state.generation = {
        status: 'idle',
        taskId: null,
        stages: [],
        request: null,
        result: null,
        error: null,
      };
    },

    upsertPost(state, action) {
      const i = state.list.findIndex((p) => p.id === action.payload.id);
      if (i >= 0) {
        state.list[i] = { ...state.list[i], ...action.payload };
      } else {
        state.list.unshift(action.payload);
      }
    },
  },
});

export const {
  setActive,
  setGeneration,
  resetGeneration,
  upsertPost,
} = slice.actions;

export default slice.reducer;