import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;
let authorization = "";

const initialState = {
  data: null, // Datos del perfil del usuario
  isLoading: false,
  error: null,
};

//  Realiza una solicitud para obtener los datos del perfil del usuario autenticado.
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

// Actualiza los datos del perfil del usuario en el servidor.
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
    // Limpia los datos del perfil en el estado, borra el token de localStorage y reinicia las variables relacionadas con la autenticación.
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
