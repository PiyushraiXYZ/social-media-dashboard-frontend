import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import workspaceReducer from '../features/workspace/workspaceSlice.js';
import accountsReducer from '../features/accounts/accountsSlice.js';
import postsReducer from '../features/posts/postsSlice.js';
import approvalReducer from '../features/approval/approvalSlice.js';
import schedulingReducer from '../features/scheduling/schedulingSlice.js';
import publicationReducer from '../features/publication/publicationSlice.js';
import notificationsReducer from '../features/notifications/notificationsSlice.js';
import brandReducer from '../features/brand/brandSlice.js';
import { apiClient } from '../lib/apiClient.js';

export const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  accounts: accountsReducer,
  posts: postsReducer,
  approval: approvalReducer,
  scheduling: schedulingReducer,
  publication: publicationReducer,
  notifications: notificationsReducer,
  brand: brandReducer,
  [apiClient.reducerPath]: apiClient.reducer,
});

