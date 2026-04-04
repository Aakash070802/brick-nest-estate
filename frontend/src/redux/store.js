import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "./persist";

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["user"],
  transforms: [
    {
      in: (state) => ({
        ...state,
        loading: false, // never persist loading
        error: null, // optional reset
      }),
      out: (state) => state,
    },
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
