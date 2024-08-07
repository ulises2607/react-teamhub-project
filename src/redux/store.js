import { configureStore } from "@reduxjs/toolkit";
import serverReducer from "./server/serverSlice";

const store = configureStore({
  reducer: {
    servers: serverReducer,
  },
});

export default store;
