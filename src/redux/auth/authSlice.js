import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  token: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api-auth/`,
        credentials
      );
      const token = response.data.token; // Accede a los datos de la respuesta directamente

      return token;
    } catch (error) {
      console.error("Error durante el login:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const auhtSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      // localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
      });
  },
});

export const { logout } = auhtSlice.actions;
export default auhtSlice.reducer;
