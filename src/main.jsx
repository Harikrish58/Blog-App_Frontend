import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";  // Import global styles
import App from "./App.jsx";  // Import the main App component
import { store, persistor } from "./Redux/Store.jsx";  // Import the Redux store and persistor
import { Provider } from "react-redux";  // Import the Redux Provider to wrap the application
import { PersistGate } from "redux-persist/integration/react";  // Import PersistGate to handle persistence
import ThemeProvider from "./Components/ThemeProvider";  // Import the ThemeProvider component for managing theme

createRoot(document.getElementById("root")).render(
  <Provider store={store}> {/* Provide the Redux store to the entire app */}
    <PersistGate loading={null} persistor={persistor}> {/* Persist the Redux store's state across sessions */}
      <ThemeProvider> {/* Wrap the App component with ThemeProvider to manage light/dark mode */}
        <App /> {/* Render the main app */}
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
