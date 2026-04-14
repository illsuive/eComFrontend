import {combineReducers, configureStore} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';

import userSlice from './slices/userSlices.js'
import productSlice from './slices/productSlice.js'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const webStorage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};
// --- FORCE FIX END ---

const persistConfig = {
  key: 'root',    
  version: 1,
  storage : webStorage,
}

const rootReducer = combineReducers({
    user: userSlice,
    products: productSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({ // Add 'export' here
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;