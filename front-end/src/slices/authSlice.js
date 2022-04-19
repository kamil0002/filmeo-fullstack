import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {},
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserPhoto: (state, action) => {
      state.user.avatar = action.payload;
    },
    updateUser: (state, action) => {
      (state.user.name = action.payload.name),
        (state.user.surname = action.payload.surname),
        (state.user.birth_date = action.payload.birth_date),
        (state.user.email = action.payload.email);
      state.user.address = action.payload.address;
    },
  },
});

export const { setUser, setUserPhoto, updateUser } = userSlice.actions;

export default userSlice.reducer;
