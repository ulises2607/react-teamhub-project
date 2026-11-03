import { combineReducers, configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profileSlice";
import serversReducer from "./serverSlice";
import messagesReducer from "./messageSlice";
import channelsReducer from "./channelSlice";
import authReducer from "./auth/authSlice";


const appReducer = combineReducers({
  profile: profileReducer, servers: serversReducer, messages: messagesReducer,
  channels: channelsReducer, auth: authReducer,
});
export const store = configureStore({
  reducer: (state, action) => {
    if (action.type === "auth/logout") {
      const auth = authReducer(state?.auth, action);
      return appReducer({ auth }, { type: "session/reset" });
    }
    if (!state?.auth?.token && action.meta?.requestStatus && !action.type.startsWith("auth/")) {
      return state || appReducer(undefined, { type: "init" });
    }
    return appReducer(state, action);
  },
});
export default store;
