import { configureStore } from "@reduxjs/toolkit";
import serverReducer from "./server/serverSlice";
import authReducer from "./auth/authSlice";

const store = configureStore({
  reducer: {
    servers: serverReducer,
    auth: authReducer,
  },
});

export default store;
