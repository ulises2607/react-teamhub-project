import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;

// Estado inicial de los servers
const initialState = {
  servers: [],
  isLoading: false,
  errors: null,
};

// Post Server
export const createServer = createAsyncThunk(
  "server/createServer",
  async (serverData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", serverData.name);
      formData.append("description", serverData.description);
      formData.append("icon", serverData.icon);

      const response = await axios.post(
        `${base_url}/teamhub/servers/`,
        formData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Error al crear servidor"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Obtención de servidores
export const getServers = createAsyncThunk(
  "server/getServers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/teamhub/servers/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "")}`,
        },
      });

      return response.data.results;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Error al obtener servidores"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    clearServers: (state) => {
      state.servers = [];
      state.isLoading = false;
      state.errors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getServers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getServers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers = action.payload;
      })
      .addCase(getServers.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(createServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers.push(action.payload);
      })
      .addCase(createServer.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export const { clearServers } = serversSlice.actions;

export default serversSlice.reducer;
