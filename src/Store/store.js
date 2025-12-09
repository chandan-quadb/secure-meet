import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { userSlice } from './Slices/UserSlice';

// Create custom storage wrapper for localStorage
const customStorage = {
  getItem: (key) => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return Promise.resolve(null);
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.error('Error setting item in storage:', error);
      return Promise.resolve();
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing item from storage:', error);
      return Promise.resolve();
    }
  },
};

const secretKey = import.meta.env.VITE_APP_REDUX_PERSIST_SECRET_KEY || 'default_fallback_key';

const encryptor = encryptTransform({
  secretKey,
  onError: (error) => {
    console.error('Redux Persist Encryption Error:', error);
    localStorage.clear();
    window.location.href = '/login';
  },
});

const persistConfig = {
  key: 'resistance',
  storage: customStorage,
  version: 1,
  transforms: [encryptor],
  whitelist: ['user'], // Only persist user slice
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.MODE !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
