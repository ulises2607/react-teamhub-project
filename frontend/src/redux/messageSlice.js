import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
const headers = () => ({
  Authorization: `Token ${localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "") || ""}`,
});
const errorMessage = (error, fallback) => error.response?.data?.detail || error.response?.data?.message || fallback;

// A profile is optional: its failure must never hide or duplicate a saved message.
const withAuthors = async (messages, requestHeaders) => {
  const ids = [...new Set(messages.map((message) => message.author))];
  const profiles = await Promise.all(ids.map(async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/users/profiles/${id}/`, { headers: requestHeaders });
      return [id, response.data];
    } catch {
      return [id, null];
    }
  }));
  const authors = Object.fromEntries(profiles);
  return messages.map((message) => ({ ...message, authorProfile: authors[message.author] }));
};

export const getMessages = createAsyncThunk("messages/getMessages", async (channelId, { rejectWithValue, signal }) => {
  try {
    const requestHeaders = headers();
    const response = await axios.get(`${baseUrl}/teamhub/messages/`, {
      headers: requestHeaders, signal, params: { channel: channelId, ordering: "created_at" },
    });
    return await withAuthors(response.data.results ?? response.data, requestHeaders);
  } catch (error) {
    return rejectWithValue(errorMessage(error, "No se pudieron cargar los mensajes."));
  }
});

export const sendMessage = createAsyncThunk("messages/sendMessage", async (messageData, { rejectWithValue }) => {
  try {
    const requestHeaders = headers();
    const response = await axios.post(`${baseUrl}/teamhub/messages/`, messageData, { headers: requestHeaders });
    return (await withAuthors([response.data], requestHeaders))[0];
  } catch (error) {
    return rejectWithValue(errorMessage(error, "No se pudo enviar el mensaje. Intenta nuevamente."));
  }
});

export const deleteMessage = createAsyncThunk("messages/deleteMessage", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${baseUrl}/teamhub/messages/${id}/`, { headers: headers() });
    return id;
  } catch (error) {
    return rejectWithValue(errorMessage(error, "No se pudo eliminar el mensaje."));
  }
});

const initialState = {
  messages: [], isLoading: false, isSending: false, deletingIds: [], errors: null,
  channelId: null, requestId: null,
};
const messageSlice = createSlice({
  name: "messages", initialState,
  reducers: { clearMessages: () => ({ ...initialState }) },
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state, action) => {
        if (state.channelId !== action.meta.arg) state.messages = [];
        state.channelId = action.meta.arg;
        state.requestId = action.meta.requestId;
        state.isLoading = true;
        state.errors = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.isLoading = false;
        if (!action.meta.aborted) state.errors = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.errors = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        if (String(state.channelId) === String(action.meta.arg.channel)) state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        if (String(state.channelId) === String(action.meta.arg.channel)) state.errors = action.payload;
      })
      .addCase(deleteMessage.pending, (state, action) => {
        state.deletingIds.push(action.meta.arg);
        state.errors = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
        state.messages = state.messages.filter((message) => message.id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
        state.errors = action.payload;
      });
  },
});
export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
