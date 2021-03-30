import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { setCriticError, setError, setSuccess } from '@core/store/snackbarMessageSlice';
import { withAuth } from '@core/withAuth/withAuth';
import { CreatingRoom } from '@features/CreatingRoom/CreatingRoom';
import { Home } from '@features/Home/Home';
import { Room } from '@features/Room/Room';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import { AnimateRoute, AnimateSwitch } from 'la-danze-ui';
import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import React, { createRef, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

function AppComponent(): JSX.Element {
  const snackBarMessage = useAppSelector((state) => state.snackbarMessage.value);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    if (snackBarMessage.criticError) {
      history.push('/');
      enqueueSnackbar(snackBarMessage.criticError, { variant: 'error' });
      dispatch(setCriticError(undefined));
    }
  }, [snackBarMessage.criticError, enqueueSnackbar, history, dispatch]);

  useEffect(() => {
    if (snackBarMessage.error) {
      enqueueSnackbar(snackBarMessage.error, { variant: 'error' });
      dispatch(setError(undefined));
    }
  }, [snackBarMessage.error, enqueueSnackbar, dispatch]);

  useEffect(() => {
    if (snackBarMessage.success) {
      enqueueSnackbar(snackBarMessage.success, { variant: 'success' });
      dispatch(setSuccess(undefined));
    }
  }, [snackBarMessage.success, enqueueSnackbar, dispatch]);

  return (
    <AnimateSwitch fullHeight animationType="scale">
      <AnimateRoute exact path="/">
        <Home />
      </AnimateRoute>
      <AnimateRoute path="/room/:roomId">
        <Room />
      </AnimateRoute>
      <AnimateRoute path="/creating-room">
        <CreatingRoom />
      </AnimateRoute>
      <AnimateRoute path="*">
        <Redirect to="/" />
      </AnimateRoute>
    </AnimateSwitch>
  );
}

function IntegrationNotistack(): JSX.Element {
  const notistackRef = createRef<SnackbarProvider>();
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef?.current?.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      action={(key) => (
        <IconButton onClick={onClickDismiss(key)}>
          <SvgIcon style={{ fontSize: '1rem' }}>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </SvgIcon>
        </IconButton>
      )}
    >
      <AppComponent />
    </SnackbarProvider>
  );
}

export const App = withAuth(IntegrationNotistack) as React.ElementType;
