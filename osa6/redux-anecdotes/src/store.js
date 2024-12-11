import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';
import anecdoteReducer from './reducers/anecdoteReducer';

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Redux Thunk sisältyy oletuksena
});

export default store;
