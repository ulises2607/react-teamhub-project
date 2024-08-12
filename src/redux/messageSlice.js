import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = "";

const initialState = {
  messages: [],
  isLoading: false,
  errors: null,
};

const fetchAuthorProfiles = async (authorIds, authorization) => {
  try {
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
      authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
      // Obtener los mensajes del canal
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
    console.log("El token que se envia alc rear mensaje: ", authorization);

    try {
      authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
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
      authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
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

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
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
        state.messages = action.payload;
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
        state.messages.push(action.payload);
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

export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
