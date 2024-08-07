import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const base_url = import.meta.env.VITE_API_URL;
const authorization = import.meta.env.VITE_AUTHORIZATION;

const initialState = {
  messages: [],
  isLoading: false,
  errors: null,
};

// Obtención de mensajes
export const getMessages = createAsyncThunk(
  'messages/getMessages',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/channels/${channelId}/messages`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to get messages');
      }
      return rejectWithValue(error.message);
    }
  }
);

// Envío de mensajes
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${base_url}/channels/${channelId}/messages`,
        { text },
        {
          headers: {
            Authorization: `Token ${authorization}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to send message');
      }
      return rejectWithValue(error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export default messagesSlice.reducer;
