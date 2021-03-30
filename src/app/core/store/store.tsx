import { authSlice } from '@core/store/authSlice';
import { roomSlice } from '@core/store/roomSlice';
import { snackbarMessageSlice } from '@core/store/snackbarMessageSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    room: roomSlice.reducer,
    snackbarMessage: snackbarMessageSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
