import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, errorText, getAll } from "../lib/api";

export const getServers = createAsyncThunk("servers/getServers", async (_, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return await getAll("/teamhub/servers/", { signal });
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
export const exploreServers = createAsyncThunk("servers/exploreServers", async (params, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return await getAll("/teamhub/servers/", { signal, params });
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
export const createServer = createAsyncThunk("servers/createServer", async (data, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    const form = new FormData(); form.append("name", data.name); form.append("description", data.description); if (data.icon) form.append("icon", data.icon); return (await api.post("/teamhub/servers/", form)).data;
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
export const joinServer = createAsyncThunk("servers/joinServer", async (server, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return (await api.post("/teamhub/members/", { server })).data;
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
const initialState = { servers: [], isLoading: false, errors: null, requestIds: {} };
const slice = createSlice({
  name: "servers", initialState,
  reducers: { clearServers: () => ({ ...initialState }) },
  extraReducers: (builder) => {
    builder.addCase(getServers.pending, (state, action) => {
      state.requestIds.list = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(getServers.fulfilled, (state, action) => {
      if (state.requestIds.list !== action.meta.requestId) return;
      delete state.requestIds.list;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.servers = action.payload;
    }).addCase(getServers.rejected, (state, action) => {
      if (state.requestIds.list !== action.meta.requestId) return;
      delete state.requestIds.list;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
    builder.addCase(exploreServers.pending, (state, action) => {
      state.requestIds.list = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(exploreServers.fulfilled, (state, action) => {
      if (state.requestIds.list !== action.meta.requestId) return;
      delete state.requestIds.list;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.servers = action.payload;
    }).addCase(exploreServers.rejected, (state, action) => {
      if (state.requestIds.list !== action.meta.requestId) return;
      delete state.requestIds.list;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
    builder.addCase(createServer.pending, (state, action) => {
      state.requestIds.createServer = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(createServer.fulfilled, (state, action) => {
      if (state.requestIds.createServer !== action.meta.requestId) return;
      delete state.requestIds.createServer;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.servers.push(action.payload);
    }).addCase(createServer.rejected, (state, action) => {
      if (state.requestIds.createServer !== action.meta.requestId) return;
      delete state.requestIds.createServer;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
    builder.addCase(joinServer.pending, (state, action) => {
      state.requestIds.joinServer = action.meta.requestId;
      state.isLoading = true; state.errors = null;
    }).addCase(joinServer.fulfilled, (state, action) => {
      if (state.requestIds.joinServer !== action.meta.requestId) return;
      delete state.requestIds.joinServer;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      
    }).addCase(joinServer.rejected, (state, action) => {
      if (state.requestIds.joinServer !== action.meta.requestId) return;
      delete state.requestIds.joinServer;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.errors = action.payload || "No se pudo completar la operación.";
    });
  },
});
export const { clearServers } = slice.actions;
export const servers = (state) => state.servers;
export default slice.reducer;
