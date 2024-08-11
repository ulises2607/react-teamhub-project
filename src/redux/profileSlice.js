import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = "";

const initialState = {
  data: null,
  isLoading: false,
  error: null,
};

// Thunk para obtener los datos del perfil
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
      const response = await axios.get(
        `${base_url}/users/profiles/profile_data/`,
        {
          headers: {
            Authorization: `Token ${authorization}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Error fetching profile data"
      );
    }
  }
);

// Thunk para actualizar el perfil
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ profileData }, { rejectWithValue }) => {
    try {
      const authorization = localStorage.getItem("tokennn")?.replace(/(^"|"$)/g, "");
      const response = await axios.put(
        `${base_url}/users/profiles/profile_data/`,
        profileData,
        {
          headers: {
            Authorization: `Token ${authorization}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Failed to update profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
      authorization = null;
      localStorage.removeItem("tokennn");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
