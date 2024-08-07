import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import serversReducer from './serverSlice';
import messagesReducer from './messageSlice';
import channelsReducer from './channelSlice';
import messageReducer from "./messageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    servers: serversReducer,
    messages: messagesReducer,
    channels: channelsReducer,
    messages: messageReducer,
  },
});

export default store;
