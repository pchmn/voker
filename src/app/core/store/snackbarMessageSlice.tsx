import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarMessageState {
  criticError?: string;
  error?: string;
  success?: string;
}
const initialState: { value: SnackbarMessageState } = { value: {} };

export const snackbarMessageSlice = createSlice({
  name: 'snackbarMessage',
  initialState: initialState,
  reducers: {
    setCriticError: (state, action: PayloadAction<string | undefined>) => {
      state.value.criticError = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.value.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | undefined>) => {
      state.value.success = action.payload;
    }
  }
});

export const { setCriticError, setError, setSuccess } = snackbarMessageSlice.actions;

export default snackbarMessageSlice.reducer;
