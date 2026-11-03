import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, readToken, errorText } from "../../lib/api";

const initialState = { token: readToken(), isLoading: false, error: null, requestId: null };
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/api-auth/", credentials);
    if (!response.data.token) throw new Error("Missing token");
    return response.data.token;
  } catch (error) {
    return rejectWithValue(errorText(error, "No se pudo iniciar sesión. Revisa tu usuario y contraseña."));
  }
}, { condition: (_, { getState }) => !getState().auth.isLoading });
const authSlice = createSlice({
  name: "auth", initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("tokennn");
      Object.assign(state, { token: null, isLoading: false, error: null, requestId: null });
    },
  },
  extraReducers: (builder) => builder
    .addCase(login.pending, (state, action) => {
      state.isLoading = true; state.error = null; state.requestId = action.meta.requestId;
    })
    .addCase(login.fulfilled, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      localStorage.setItem("tokennn", JSON.stringify(action.payload));
      state.isLoading = false; state.token = action.payload;
    })
    .addCase(login.rejected, (state, action) => {
      if (state.requestId !== action.meta.requestId) return;
      state.isLoading = false; state.error = action.payload || "No se pudo iniciar sesión.";
    }),
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
