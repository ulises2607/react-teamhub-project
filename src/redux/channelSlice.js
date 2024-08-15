import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = "";
// Estado inicial
const initialState = {
  channels: [], // Lista de canales obtenidos de la API que se inicia vacía
  isLoading: false, // Indicador de si una operacion de gestion de canales está en curso
  errors: null, // Indicador de mensaje de error en caso de fallos en las operaciones con canales
};

// Obtención de canales
export const getChannels = createAsyncThunk("channel/getChannels", async () => {
    //Esta funcion asincrona obtiene una lista de canales de la API utilizando un token de autenticacion almacenado en localStorage
  try {
    authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
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
    // Esta funcion crea un nuevo canal en el servidor. En caso de exito, devuelve los datos del canal recien creado. En caso de error, devuelve un mensaje de error
    try {
      const response = await axios.post(
        `${base_url}/teamhub/channels/`,
        {
          name: name,
          server: server,
        },
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
    // Esta funcion actualiza el nombre de un canal en el servidor. Recibe el ID y el nuevo nombre del canal. En caso de exito, devuelve los datos del canal actualizados. En caso de error, devuelve un mensaje de error
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
    // Esta funcion elimina un canal en el servidor. Recibe el ID del canal. En caso de exito, devuelve el ID del canal eliminado. En caso de error, devuelve un mensaje de error
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
      authorization = null; // Limpia el token de autorizacion al limpiar los canales.
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChannels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = action.payload; // Almacena la lista de canales obtenidos
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
        state.channels.push(action.payload); // Añade el nuevo canal a la lista
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
          state.channels[index] = action.payload; // Actualiza el canal en la lista
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
          (channel) => channel.id !== action.payload // Elimina el canal de la lista
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
