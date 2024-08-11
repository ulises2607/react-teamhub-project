import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;

const initialState = {
  data: null,
  allProfiles: [],
  isLoading: false,
  error: null,
};

// Thunk para obtener los datos del perfil
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${base_url}/users/profiles/profile_data/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch profile data"
      );
    }
  }
);

// Thunk para actualizar el perfil
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ token, profileData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${base_url}/users/profiles/profile_data/`,
        profileData,
        {
          headers: {
            Authorization: `Token ${token}`,
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

// Funcion para la obtencion de todo slos perfiles
export const fetchAllProfiles = createAsyncThunk(
  "profile/fetchAllProfiles",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/users/profiles/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to fetch all profiles"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
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
      })
      .addCase(fetchAllProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProfiles = action.payload;
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
