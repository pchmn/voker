import { withAuth } from '@core/withAuth/withAuth';
import { CreatingRoom } from '@features/CreatingRoom/CreatingRoom';
import { Home } from '@features/Home/Home';
import { Room } from '@features/Room/Room';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import { AnimateRoute, AnimateSwitch } from 'la-danze-ui';
import { SnackbarKey, SnackbarProvider, useSnackbar } from 'notistack';
import React, { createRef, useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { Redirect, useHistory } from 'react-router-dom';

createStore('criticError', null);
createStore('error', null);
createStore('success', null);

function AppComponent(): JSX.Element {
  const [criticError, setCriticError] = useStore<string | null>('criticError');
  const [error, setError] = useStore<string | null>('error');
  const [success, setSuccess] = useStore<string | null>('success');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    if (criticError) {
      history.push('/');
      enqueueSnackbar(criticError, { variant: 'error' });
      setCriticError(null);
    }
  }, [criticError, setCriticError, enqueueSnackbar, history]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      setError(null);
    }
  }, [error, setError, enqueueSnackbar]);

  useEffect(() => {
    if (success) {
      enqueueSnackbar(success, { variant: 'success' });
      setSuccess(null);
    }
  }, [success, setSuccess, enqueueSnackbar]);

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
