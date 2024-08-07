import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const authorization = import.meta.env.VITE_AUTHORIZATION;

// Estado inicial de los servers
const initialState = {
  servers: [],
  isLoading: false,
  errors: null,
  messages: null,
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
      // console.log("formdata que llega: ", serverData);

      const response = await axios.post(
        `${base_url}/teamhub/servers`,
        formData,
        {
          headers: {
            Authorization: `Token ${authorization}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const server = response.data;
      console.log("La repsuesta del post: ", server);

      return server;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to create server"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Obtencion de servidores
export const getServers = createAsyncThunk("server/getServers", async () => {
  try {
    const response = await axios.get(`${base_url}/teamhub/servers`, {
      headers: {
        Authorization: `Token ${authorization}`,
      },
    });
    const servers = response.data;
    console.log("Servers en la petición: ", servers.results);

    return servers.results;
  } catch (error) {
    throw new Error(error.message);
  }
});

export const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {},
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
        // console.log(action.payload);
      })
      .addCase(createServer.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

export default serversSlice.reducer;
