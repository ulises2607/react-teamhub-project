import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, errorText, getAll } from "../lib/api";

export const getChannels = createAsyncThunk("channels/getChannels", async (serverId, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return await getAll("/teamhub/channels/", { signal, params: { server: serverId } });
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
export const createChannel = createAsyncThunk("channels/createChannel", async (data, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return (await api.post("/teamhub/channels/", data)).data;
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
export const updateChannel = createAsyncThunk("channels/updateChannel", async ({ id, name }, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return (await api.patch(`/teamhub/channels/${id}/`, { name })).data;
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
export const deleteChannel = createAsyncThunk("channels/deleteChannel", async (id, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    await api.delete(`/teamhub/channels/${id}/`); return id;
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
const initialState = { channels: [], isLoading: false, errors: null, requestIds: {} };
const slice = createSlice({
  name: "channels", initialState,
  reducers: { clearChannels: () => ({ ...initialState }) },
  extraReducers: (builder) => {
    builder.addCase(getChannels.pending, (state, action) => {
      state.requestIds.getChannels = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(getChannels.fulfilled, (state, action) => {
      if (state.requestIds.getChannels !== action.meta.requestId) return;
      delete state.requestIds.getChannels;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.channels = action.payload;
    }).addCase(getChannels.rejected, (state, action) => {
      if (state.requestIds.getChannels !== action.meta.requestId) return;
      delete state.requestIds.getChannels;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
    builder.addCase(createChannel.pending, (state, action) => {
      state.requestIds.createChannel = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(createChannel.fulfilled, (state, action) => {
      if (state.requestIds.createChannel !== action.meta.requestId) return;
      delete state.requestIds.createChannel;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.channels.push(action.payload);
    }).addCase(createChannel.rejected, (state, action) => {
      if (state.requestIds.createChannel !== action.meta.requestId) return;
      delete state.requestIds.createChannel;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
    builder.addCase(updateChannel.pending, (state, action) => {
      state.requestIds.updateChannel = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(updateChannel.fulfilled, (state, action) => {
      if (state.requestIds.updateChannel !== action.meta.requestId) return;
      delete state.requestIds.updateChannel;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.channels = state.channels.map((item) => item.id === action.payload.id ? action.payload : item);
    }).addCase(updateChannel.rejected, (state, action) => {
      if (state.requestIds.updateChannel !== action.meta.requestId) return;
      delete state.requestIds.updateChannel;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
    builder.addCase(deleteChannel.pending, (state, action) => {
      state.requestIds.deleteChannel = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(deleteChannel.fulfilled, (state, action) => {
      if (state.requestIds.deleteChannel !== action.meta.requestId) return;
      delete state.requestIds.deleteChannel;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.channels = state.channels.filter((item) => item.id !== action.payload);
    }).addCase(deleteChannel.rejected, (state, action) => {
      if (state.requestIds.deleteChannel !== action.meta.requestId) return;
      delete state.requestIds.deleteChannel;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
  },
});
export const { clearChannels } = slice.actions;
export default slice.reducer;
