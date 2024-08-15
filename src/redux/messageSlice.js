import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Se define la URL base para las peticiones a la API usando variables de entorno.
const base_url = import.meta.env.VITE_API_URL;
let authorization = ""; // Variable para almacenar el token de autorización.

// Estado inicial del slice de mensajes.
const initialState = {
  messages: [], // Array para almacenar los mensajes.
  isLoading: false, // Indicador de si se está cargando la información.
  errors: null, // Almacena errores en caso de que ocurran.
};

// Función auxiliar que obtiene los perfiles de los autores a partir de sus IDs.
const fetchAuthorProfiles = async (authorIds, authorization) => {
  try {
    // Creamos un array de promesas para obtener los perfiles de cada autor.
    const authorPromises = authorIds.map((id) =>
      axios.get(`${base_url}/users/profiles/${id}/`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
      })
    );

    // Espera a que todas las promesas se resuelvan
    const authorProfiles = await Promise.all(authorPromises);

    // Devuelve un mapa con los perfiles de los autores por su ID
    return authorProfiles.reduce((acc, profile) => {
      const userId = profile.data.user__id;
      acc[userId] = profile.data;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching author profiles:", error);
    throw new Error("Failed to fetch author profiles");
  }
};

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (channelId, { rejectWithValue }) => {
    try {
      // Obtenemos el token de autorización desde el almacenamiento local.
      authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
      
      // Hacemos una solicitud GET para obtener los mensajes de un canal específico.
      const response = await axios.get(`${base_url}/teamhub/messages/`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
        params: {
          channel: channelId,
          ordering: "created_at",
        },
      });

      const messages = response.data.results;

      // Crear un array de IDs únicos de autores
      const authorIds = [...new Set(messages.map((msg) => msg.author))];

      // Obtener los perfiles de los autores
      const authorProfilesMap = await fetchAuthorProfiles(
        authorIds,
        authorization
      );

      // Añadir los perfiles de los autores a los mensajes
      const messagesWithAuthors = messages.map((msg) => ({
        ...msg,
        authorProfile: authorProfilesMap[msg.author] || null,
      }));

      return messagesWithAuthors;
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

// Enviar un nuevo mensaje
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData, { rejectWithValue }) => {
    // Obtener el token de autorización desde el almacenamiento local.
    try {
      authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
      
      // Hacemos una solicitud POST para enviar un nuevo mensaje.
      const response = await axios.post(
        `${base_url}/teamhub/messages/`,
        messageData,
        {
          headers: {
            Authorization: `Token ${authorization}`,
          },
        }
      );

      const newMessage = response.data;

      // Obtener el perfil del autor del nuevo mensaje
      const authorProfileResponse = await axios.get(
        `${base_url}/users/profiles/${newMessage.author}/`,
        {
          headers: {
            Authorization: `Token ${authorization}`,
          },
        }
      );

      // Agregar el perfil del autor al nuevo mensaje
      const newMessageWithAuthorProfile = {
        ...newMessage,
        authorProfile: authorProfileResponse.data,
      };

      return newMessageWithAuthorProfile;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to send message"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      // Obtenemos el token de autorización desde el almacenamiento local.
      authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
      
      // Hacemos una solicitud DELETE para eliminar un mensaje por su ID.
      await axios.delete(`${base_url}/teamhub/messages/${messageId}/`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
      });

      return messageId; // Retornamos el id del mensaje eliminado por si se usa despues
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to delete message"
        );
      }
      return rejectWithValue(error.message);
    }
  }
);

// Definimos el slice de mensajes con sus reducers y casos extra.
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // Reducer para limpiar los mensajes y resetear el estado.
    clearMessages: (state) => {
      state.messages = [];
      state.isLoading = false;
      state.errors = null;
      authorization = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload; // Guardamos los mensajes obtenidos.
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload); // Añadimos el nuevo mensaje.
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Filtramos los mensajes para eliminar el mensaje por su ID.
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.errors = action.payload;
      });
  },
});

// Exportamos las acciones y el reducer del slice.
export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
