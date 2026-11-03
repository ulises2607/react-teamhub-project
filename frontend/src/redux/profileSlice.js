import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, errorText } from "../lib/api";

export const fetchProfile = createAsyncThunk("profile/fetchProfile", async (_, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return (await api.get("/users/profiles/profile_data/", { signal })).data;
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
export const updateProfile = createAsyncThunk("profile/updateProfile", async ({ profileData }, { rejectWithValue, signal }) => {
  try {
    signal.throwIfAborted();
    return (await api.patch("/users/profiles/profile_data/", profileData)).data;
  } catch (error) {
    return rejectWithValue(errorText(error));
  }
});
const initialState = { data: null, isLoading: false, error: null, requestIds: {} };
const slice = createSlice({
  name: "profile", initialState,
  reducers: { clearProfile: () => ({ ...initialState }) },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state, action) => {
      state.requestIds.fetchProfile = action.meta.requestId;
      state.isLoading = true; state.error = null;
    }).addCase(fetchProfile.fulfilled, (state, action) => {
      if (state.requestIds.fetchProfile !== action.meta.requestId) return;
      delete state.requestIds.fetchProfile;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.data = action.payload;
    }).addCase(fetchProfile.rejected, (state, action) => {
      if (state.requestIds.fetchProfile !== action.meta.requestId) return;
      delete state.requestIds.fetchProfile;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.error = action.payload || "No se pudo completar la operación.";
    });
    builder.addCase(updateProfile.pending, (state, action) => {
      state.requestIds.updateProfile = action.meta.requestId;
      state.isLoading = true; state.error = null;
    }).addCase(updateProfile.fulfilled, (state, action) => {
      if (state.requestIds.updateProfile !== action.meta.requestId) return;
      delete state.requestIds.updateProfile;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      state.data = action.payload;
    }).addCase(updateProfile.rejected, (state, action) => {
      if (state.requestIds.updateProfile !== action.meta.requestId) return;
      delete state.requestIds.updateProfile;
      state.isLoading = Object.keys(state.requestIds).length > 0;
      if (!action.meta.aborted) state.error = action.payload || "No se pudo completar la operación.";
    });
  },
});
export const { clearProfile } = slice.actions;
export default slice.reducer;
