import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");

const initialState = {
  channels: [],
  isLoading: false,
  errors: null,
};

// Obtención de canales
export const getChannels = createAsyncThunk("channel/getChannels", async () => {
  try {
    const response = await axios.get(`${base_url}/teamhub/channels`, {
      headers: {
        Authorization: `Token ${authorization}`,
      },
    });
    const channels = response.data.results;
    return channels;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Creación de canales
export const createChannel = createAsyncThunk(
  "channels/createChannel",
  async ({ server, name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${base_url}/teamhub/channels/`,
        {
          name: name, // Aquí enviamos el nombre como string
          server: server, // Aquí enviamos el ID del servidor como entero
        },
        {
          headers: {
            Authorization: `Token ${authorization}`,
            "Content-Type": "application/json", // Cambiamos el tipo de contenido a JSON
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to create channel"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Actualización de canales
export const updateChannel = createAsyncThunk(
  "channels/updateChannel",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${base_url}/teamhub/channels/${id}`,
        { name },
        {
          headers: {
            Authorization: `Token ${authorization}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to update channel"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Eliminación de canales
export const deleteChannel = createAsyncThunk(
  "channels/deleteChannel",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${base_url}/teamhub/channels/${id}`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
      });
      return id;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to delete channel"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    clearChannels: (state) => {
      state.data = null;
      state.isLoading = false;
      state.errors = null;
      authorization = null;
    },
  },
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
      })
      .addCase(updateChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.channels.findIndex(
          (channel) => channel.id === action.payload.id
        );
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(deleteChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = state.channels.filter(
          (channel) => channel.id !== action.payload
        );
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export const { clearChannels } = channelsSlice.actions;

export default channelsSlice.reducer;
