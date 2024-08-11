import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
const authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");

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

    console.log("La promesa de la obtecnion de datos: ", authorProfiles);

    // Devuelve un mapa con los perfiles de los autores por su ID
    return authorProfiles.reduce((acc, profile) => {
      const userId = profile.data.user__id;
      acc[userId] = profile.data;
      console.log("El acumulador: ", acc);

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

      // Crear un array de IDs únicos de autores
      const authorIds = [...new Set(messages.map((msg) => msg.author))];
      console.log("Los IDs de los autores:", authorIds);

      // Obtener los perfiles de los autores
      const authorProfilesMap = await fetchAuthorProfiles(
        authorIds,
        authorization
      );
      console.log("Mapa de perfiles de autores:", authorProfilesMap);

      // Añadir los perfiles de los autores a los mensajes
      const messagesWithAuthors = messages.map((msg) => ({
        ...msg,
        authorProfile: authorProfilesMap[msg.author],
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
