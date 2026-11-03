import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, errorText, getAll } from "../lib/api";

// A profile is optional: its failure must never hide or duplicate a saved message.
const withAuthors = async (messages, requestHeaders) => {
  const ids = [...new Set(messages.map((message) => message.author))];
  const profiles = await Promise.all(ids.map(async (id) => {
    try {
      const response = await api.get(`/users/profiles/${id}/`, { headers: requestHeaders });
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
    const requestHeaders = {};
    const messages = await getAll("/teamhub/messages/", { signal, params: { channel: channelId, ordering: "created_at" } });
    return await withAuthors(messages, requestHeaders);
  } catch (error) {
    return rejectWithValue(errorText(error, "No se pudieron cargar los mensajes."));
  }
});

export const sendMessage = createAsyncThunk("messages/sendMessage", async (messageData, { rejectWithValue }) => {
  try {
    const requestHeaders = {};
    const response = await api.post(`/teamhub/messages/`, messageData, { headers: requestHeaders });
    return (await withAuthors([response.data], requestHeaders))[0];
  } catch (error) {
    return rejectWithValue(errorText(error, "No se pudo enviar el mensaje. Intenta nuevamente."));
  }
});

export const deleteMessage = createAsyncThunk("messages/deleteMessage", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/teamhub/messages/${id}/`, { headers: {} });
    return id;
  } catch (error) {
    return rejectWithValue(errorText(error, "No se pudo eliminar el mensaje."));
  }
});

const initialState = {
  messages: [], isLoading: false, isSending: false, deletingIds: [], errors: null,
  channelId: null, requestId: null, sendRequestId: null, deleteRequests: {},
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
      .addCase(sendMessage.pending, (state, action) => {
        state.sendRequestId = action.meta.requestId;
        state.isSending = true;
        state.errors = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.sendRequestId !== action.meta.requestId) return;
        state.sendRequestId = null;
        state.isSending = false;
        if (String(state.channelId) === String(action.meta.arg.channel)) state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        if (state.sendRequestId !== action.meta.requestId) return;
        state.sendRequestId = null;
        state.isSending = false;
        if (String(state.channelId) === String(action.meta.arg.channel)) state.errors = action.payload;
      })
      .addCase(deleteMessage.pending, (state, action) => {
        state.deletingIds.push(action.meta.arg);
        state.deleteRequests[action.meta.arg] = action.meta.requestId;
        state.errors = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        if (state.deleteRequests[action.meta.arg] !== action.meta.requestId) return;
        delete state.deleteRequests[action.meta.arg];
        state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
        state.messages = state.messages.filter((message) => message.id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        if (state.deleteRequests[action.meta.arg] !== action.meta.requestId) return;
        delete state.deleteRequests[action.meta.arg];
        state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
        state.errors = action.payload;
      });
  },
});
export const { clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
