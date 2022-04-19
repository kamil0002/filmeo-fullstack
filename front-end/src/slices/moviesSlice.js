import { createSlice } from '@reduxjs/toolkit';

export const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    all: [],
  },

  reducers: {
    setMovies: (state, action) => {
      state.all = action.payload;
    },
  },
});

export const { setMovies } = moviesSlice.actions;

export default moviesSlice.reducer;
