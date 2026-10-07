import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'posts',
  initialState: {
    list: [],
    activeId: null,
    generation: { status: 'idle', stages: [], taskId: null },
  },
  reducers: {
    setActive(state, a) { state.activeId = a.payload; },
    setGeneration(state, a) { state.generation = { ...state.generation, ...a.payload }; },
    upsertPost(state, a) {
      const i = state.list.findIndex((p) => p.id === a.payload.id);
      if (i >= 0) state.list[i] = { ...state.list[i], ...a.payload };
      else state.list.unshift(a.payload);
    },
  },
});

export const { setActive, setGeneration, upsertPost } = slice.actions;
export default slice.reducer;
