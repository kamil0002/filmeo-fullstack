import { configureStore } from '@reduxjs/toolkit';
import browsingGenreReducer from 'slices/browsingGenreSlice';
import moviesReducer from 'slices/moviesSlice';
import userReducer from 'slices/authSlice';

export default configureStore({
  reducer: {
    browsingGenre: browsingGenreReducer,
    movies: moviesReducer,
    auth: userReducer,
  },
});
