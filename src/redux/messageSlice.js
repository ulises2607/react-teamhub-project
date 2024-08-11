import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const authorization = localStorage.getItem("token");

const initialState = {
  messages: [],
  isLoading: false,
  errors: null,
};

// Obtener mensajes de un canal
// export const getMessages = createAsyncThunk(
//   "messages/getMessages",
//   async (channelId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${base_url}/teamhub/messages/`, {
//         headers: {
//           Authorization: `Token ${authorization}`,
//         },
//         params: {
//           channel: channelId,
//         },
//       });
//       return response.data.results;
//     } catch (error) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(
//           error.response.data.message || "Failed to fetch messages"
//         );
//       }
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const getMessages = createAsyncThunk(
  "messages/getMessages",
  async (channelId, { rejectWithValue }) => {
    try {
      // Obtener los mensajes del canal
      const response = await axios.get(`${base_url}/teamhub/messages/`, {
        headers: {
          Authorization: `Token ${authorization}`,
        },
        params: {
          channel: channelId,
        },
      });

      const messages = response.data.results;

      // Se crea un array de ids únicos de autores para evitar peticiones innecesarias
      const authorIds = [...new Set(messages.map((msg) => msg.author))];

      // Se haycen las peticiones para obtener los perfiles de los autores
      const authorProfilesPromises = authorIds.map((id) =>
        axios.get(`${base_url}/users/profiles/${id}/`, {
          headers: {
            Authorization: `Token ${authorization}`,
          },
        })
      );

      // Se esperan a que todas las peticiones hayan fiunalizado
      const authorProfiles = await Promise.all(authorProfilesPromises);

      console.log("Los authores obtenidos", authorProfiles.data);

      // Mapear los perfiles de los autores por su id
      const authorProfilesMap = authorProfiles.reduce((acc, profile) => {
        acc[profile.data.id] = profile.data;
        return acc;
      }, {});

      console.log("Author Profiles Map: ", authorProfilesMap.undefined);

      // Añadiendoo los datos del autor a cada mensaje
      const messagesWithAuthors = messages.map((msg) => ({
        ...msg,
        authorProfile: msg.id == authorProfilesMap, // Verificar esta parte urg
      }));

      console.log("Messages with Authors: ", messagesWithAuthors);

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
    try {
      const response = await axios.post(
        `${base_url}/teamhub/messages/`,
        messageData,
        {
          headers: {
            Authorization: `Token ${authorization}`,
          },
        }
      );
      return response.data;
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

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
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
      });
  },
});

export default messageSlice.reducer;
