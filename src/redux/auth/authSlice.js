import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  token: JSON.parse(localStorage.getItem("tokennn")) || null,
  isLoading: false,
  error: null,
  message: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api-auth/`,
        credentials
      );
      const token = response.data.token;
      localStorage.setItem("tokennn", JSON.stringify(token));
      console.log("Para el localstorage: ", JSON.stringify(token));

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
      localStorage.removeItem("tokennn");
      state.token = null;
      state.isLoading = false;
      state.error = null;
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
      });
  },
});

export const { logout } = auhtSlice.actions;

export default auhtSlice.reducer;
