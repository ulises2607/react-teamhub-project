import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = "";

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
      const authorization = localStorage
        .getItem("tokennn")
        ?.replace(/(^"|"$)/g, "");
      const formData = new FormData();
      formData.append("name", serverData.name);
      formData.append("description", serverData.description);
      formData.append("icon", serverData.icon);

      const response = await axios.post(
        `${base_url}/teamhub/servers/`,
        formData,
        {
          headers: {
            Authorization: `Token ${authorization}`,
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
      const authorization = localStorage
        .getItem("tokennn")
        ?.replace(/(^"|"$)/g, "");
      const response = await axios.get(`${base_url}/teamhub/servers/`, {
        headers: {
          Authorization: `Token ${authorization}`,
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

// Explorar servidores
export const exploreServers = createAsyncThunk(
  "server/exploreServers",
  async (queryParams, { rejectWithValue }) => {
    try {
      const authorization = localStorage
        .getItem("tokennn")
        ?.replace(/(^"|"$)/g, "");
      const response = await axios.get(`${base_url}/teamhub/servers/`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
        params: queryParams,
      });
      return response.data.results;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Error al explorar servidores"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Unirse a un servidor
export const joinServer = createAsyncThunk(
    "servers/joinServer",
    async (serverId, { rejectWithValue }) => {
      try {
        const authorization = localStorage
          .getItem("tokennn")
          ?.replace(/(^"|"$)/g, "");
          
        const requestBody = {
          "server": serverId
        };
  
        const response = await axios.post(
          `${base_url}/teamhub/members/`,
          requestBody,
          {
            headers: {
              Authorization: `Token ${authorization}`,
              "Content-Type": "application/json"
            },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    clearServers: (state) => {
      localStorage.removeItem("tokennn");
      state.servers = [];
      state.isLoading = false;
      state.errors = null;
      authorization = null;
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
      })
      .addCase(joinServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinServer.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(joinServer.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(exploreServers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exploreServers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers = action.payload;
      })
      .addCase(exploreServers.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload.detail || "Error al explorar servidores";
      });
  },
});

export const { clearServers } = serversSlice.actions;

export const servers = (state) => state.servers;

export default serversSlice.reducer;
