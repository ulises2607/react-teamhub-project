import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = "";

// Estado inicial de los servers
const initialState = {
  servers: [], // Lista de servidores
  isLoading: false,
  errors: null,
};

// Envía una solicitud para crear un nuevo servidor.
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
        //Envía los datos del servidor como un FormData incluyendo nombre, descripción e ícono.
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

// Obtiene la lista de servidores del usuario autenticado.
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

// Explora servidores en la plataforma basándose en parámetros de consulta.
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

// Permite unirse a un servidor enviando una solicitud con el ID del servidor.
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
    // Limpia la lista de servidores y resetea el estado relacionado con errores y la autenticación.
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
