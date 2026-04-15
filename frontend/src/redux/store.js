import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";

import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "./persist"; // use default

const rootReducer = combineReducers({
  user: userReducer,
});

const userTransform = createTransform(
  (inboundState) => ({
    currentUser: inboundState.currentUser, // only persist useful data
  }),
  (outboundState) => ({
    ...outboundState,
    authLoading: false,
    globalLoading: false,
    listingLoading: false,
    error: null,
  }),
  { whitelist: ["user"] },
);

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["user"],
  transforms: [userTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.MODE !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
