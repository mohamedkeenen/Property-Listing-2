import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi';
import { settingsApi } from './services/settingsApi';
import { userApi } from './services/userApi';
import { propertyApi } from './services/propertyApi';
import { leadsApi } from './services/leadsApi';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [propertyApi.reducerPath]: propertyApi.reducer,
    [leadsApi.reducerPath]: leadsApi.reducer,
    auth: authReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      settingsApi.middleware, 
      userApi.middleware, 
      propertyApi.middleware,
      leadsApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
