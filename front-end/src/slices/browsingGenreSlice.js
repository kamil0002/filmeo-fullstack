import { createSlice } from '@reduxjs/toolkit';

export const browsingGenreSlice = createSlice({
  name: 'browsingGenre',
  initialState: {
    genreName: 'Akcja',
  },
  reducers: {
    changeGenre: (state, action) => {
      state.genreName = action.payload;
    },
  },
});

export const { changeGenre } = browsingGenreSlice.actions;

export default browsingGenreSlice.reducer;
