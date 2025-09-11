import rootReducer from "./reducers/index.js";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root_data",
  storage,
};

// 1. Wrap the root reducer to handle RESET_ALL action
const resettableRootReducer = (state, action) => {
  if (action.type === "RESET_ALL") {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (
        key &&
        key !== "moe_data" &&
        key !== "MOE_DATA" &&
        !key?.startsWith("moe_") &&
        !key?.startsWith("MOE_")
      ) {
        localStorage.removeItem(key);
      }
    }
    // localStorage.clear();
    // Return initial state by passing undefined
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

// 2. Apply persistReducer to the resettable reducer
const persistedReducer = persistReducer(persistConfig, resettableRootReducer);

// 3. Configure the store as before
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

// 4. Export a helper function to dispatch RESET_ALL
export const resetReduxStore = () => {
  // store.dispatch({ type: "RESET_ALL" });
  localStorage.removeItem("persist:root_data");
  window.location.reload();
};

export { store as default, persistor };
