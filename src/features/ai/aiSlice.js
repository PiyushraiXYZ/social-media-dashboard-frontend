import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi! I'm your AI assistant. Ask me anything about your social media content, posting strategies, or how to improve your posts.",
      sources: [],
      timestamp: new Date().toISOString(),
    },
  ],
  isOpen: false,
  isTyping: false,
  error: null,
};

const slice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    openChat(state) {
      state.isOpen = true;
    },
    closeChat(state) {
      state.isOpen = false;
    },
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },

    addMessage(state, action) {
      state.messages.push({
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },

    setTyping(state, action) {
      state.isTyping = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    clearMessages(state) {
      state.messages = [initialState.messages[0]];
      state.error = null;
    },
  },
});

export const {
  openChat,
  closeChat,
  toggleChat,
  addMessage,
  setTyping,
  setError,
  clearMessages,
} = slice.actions;

export default slice.reducer;