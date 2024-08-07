import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const base_url = import.meta.env.VITE_API_URL;
const authorization = import.meta.env.VITE_AUTHORIZATION;

const initialState = {
  channels: [],
  isLoading: false,
  errors: null,
};

// Obtención de canales
export const getChannels = createAsyncThunk(
  'channels/getChannels',
  async (serverId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/teamhub/channels/`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Error al obtener canales');
      }
      return rejectWithValue(error.message);
    }
  }
);

// Creación de canales
export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async ({ serverId, name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${base_url}/teamhub/channels/${serverId}`,
        { name },
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
        return rejectWithValue(error.response.data.message || 'Error al crear canal');
      }
      return rejectWithValue(error.message);
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChannels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = action.payload;
      })
      .addCase(getChannels.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(createChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels.push(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export default channelsSlice.reducer;
