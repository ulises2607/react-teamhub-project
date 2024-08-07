import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import serversReducer from './serverSlice';
import messagesReducer from './messageSlice';
import channelsReducer from './channelSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    servers: serversReducer,
    messages: messagesReducer,
    channels: channelsReducer,
  },
});

export default store;
