import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// Estado inicial
const initialState = {
  token: JSON.parse(localStorage.getItem("tokennn")) || null, // Token de autenticacion almacenado en el LocalStorage o null si no existe
  isLoading: false, // Indicador de si una operacion de autenticacion está en curso
  error: null, // Mensaje de error en caso de fallo en la autenticacion setteado como null al inicio
  message: null, // Mensaje informativo opcional setteado como null al inicio
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
      localStorage.setItem("tokennn", JSON.stringify(token)); // Guarda el token generado en localStorage

      return token;
    } catch (error) {
      console.error("Error durante el login:", error);
      return rejectWithValue(error.response?.data || error.message); //Se rechaza la accion con un mensaje de error
    }
  }
);

const auhtSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("tokennn"); // Elimina el token del localStorage al cerrar sesion.
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true; // Activa el indicador de carga cuando se inicia el login
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false; // Desactiva el indicador de carga cuando el login es exitoso
        state.token = action.payload; // Almacena el token recibido en el estado
      });
  },
});

export const { logout } = auhtSlice.actions;

export default auhtSlice.reducer;
