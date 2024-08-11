import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
console.log("Autorizacion-Token en serverSlice: ", authorization);

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

      const server = response.data;
      return server;
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
      // Obtener los mensajes del canal
      const response = await axios.get(`${base_url}/teamhub/servers/`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
      });

      const servers = response.data.results;

      return servers;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch messages"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// export const getServers = createAsyncThunk(
//   "server/getServers",
//   async (_, { getState }) => {
//     try {
//       const profile = getState().profile.data;

//       if (!profile) {
//         throw new Error("Datos de perfil no encontrados");
//       }

//       const userId = profile.user__id;
//       const response = await axios.get(`${base_url}/teamhub/servers`, {
//         headers: {
//           Authorization: `Token ${authorization}`,
//         },
//       });

//       const servers = await response.json();
//       console.log("Todos los servidores:", servers);

//       const userServers = servers.filter(
//         (server) => server.members.includes(userId) || server.owner == userId
//       );
//       //console.log("Servidores filtrados:",userServers);

//       return userServers;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
// );

export const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    clearServers: (state) => {
      state.servers = null;
      state.isLoading = false;
      state.errors = null;
      state.messages = null;
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
      });
  },
});

export const { clearServers } = serversSlice.actions;

export default serversSlice.reducer;
