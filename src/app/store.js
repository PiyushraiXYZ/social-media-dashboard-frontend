import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../store/rootReducer.js';
import { apiClient } from '../lib/apiClient.js';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().concat(apiClient.middleware),
  devTools: import.meta.env.DEV,
});
