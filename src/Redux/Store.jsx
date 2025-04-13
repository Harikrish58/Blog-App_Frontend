import { combineReducers, configureStore } from "@reduxjs/toolkit"; // Importing necessary Redux Toolkit functions
import userReducer from "./Slice/userSlice"; // Importing the user slice reducer
import themeReducer from "./Slice/themeSlice"; // Importing the theme slice reducer
import storage from "redux-persist/lib/storage"; // Importing localStorage for persistence
import { persistReducer, persistStore } from "redux-persist"; // Importing functions for persistence

// Combining user and theme reducers into a rootReducer
const rootReducer = combineReducers({
  user: userReducer, // User-related state management
  theme: themeReducer, // Theme-related state management
});

// Persist configuration setup for the Redux store, defining the storage and version
const persistConfig = {
  key: "root", // The key used in localStorage for the persisted state
  storage, // Using localStorage for persistence
  version: 1, // Versioning of the persisted data
};

// Wrapping the rootReducer with persistReducer to enable persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Creating and configuring the Redux store with the persistedReducer
export const store = configureStore({
  reducer: persistedReducer, // Using the persisted reducer for the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable state checks for Redux Persist
    }),
});

// Persistor is responsible for persisting the store and rehydrating it
export const persistor = persistStore(store);
