import { configureStore } from '@reduxjs/toolkit';
import serversReducer from './serverSlice';
import messagesReducer from './messageSlice';
import channelsReducer from './channelSlice';
import messageReducer from "./messageSlice";

export const store = configureStore({
  reducer: {
    servers: serversReducer,
    messages: messagesReducer,
    channels: channelsReducer,
    messages: messageReducer,
  },
});

export default store;
