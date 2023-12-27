/* eslint-disable @typescript-eslint/no-unused-vars */
import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore} from "redux-persist";
import userReducers from "./user/userSlice";
import storage from "redux-persist/lib/storage";

// Combine Reducers
const rootReducers = combineReducers({user: userReducers});
// Presiste reducers
const persistConfig = { key: "root", storage, version: 1 }
const presistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: {
    user: presistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);