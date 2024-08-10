import { configureStore } from "@reduxjs/toolkit";
import serversReducer from "./serverSlice";
import messagesReducer from "./messageSlice";
import channelsReducer from "./channelSlice";
import authReducer from "./auth/authSlice";
import profileReducer from "./profileSlice";

export const store = configureStore({
  reducer: {
    servers: serversReducer,
    messages: messagesReducer,
    channels: channelsReducer,
    auth: authReducer,
    profile: profileReducer,
  },
});

export default store;
