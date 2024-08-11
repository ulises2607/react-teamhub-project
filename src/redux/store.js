import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import serversReducer from "./serverSlice";
import messagesReducer from "./messageSlice";
import channelsReducer from "./channelSlice";
import authReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    servers: serversReducer,
    messages: messagesReducer,
    channels: channelsReducer,
    auth: authReducer,
  },
});

export default store;
