import { FirebaseUser } from '@core/useFirebase/models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  currentUser?: FirebaseUser;
}
const initialState: { value: AuthState } = { value: {} };

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<FirebaseUser | undefined>) => {
      state.value.currentUser = action.payload;
    },
    resetCurrentUser: (state) => {
      state.value = {};
    }
  }
});

export const { setCurrentUser, resetCurrentUser } = authSlice.actions;

export default authSlice.reducer;
