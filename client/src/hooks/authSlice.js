// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginState: (state, action) => {
        console.log(action.payload)
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
    }
  }
});

export const { setLoginState, logout } = authSlice.actions;
export default authSlice.reducer;
