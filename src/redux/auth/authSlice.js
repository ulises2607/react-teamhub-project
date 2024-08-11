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

export const logout = createAsyncThunk("user/logoutUser", async () => {
  localStorage.removeItem("tokennn");
  return { message: "Logged out successfully." };
});

const auhtSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.message = action.payload.message;
      });
  },
});

export default auhtSlice.reducer;
