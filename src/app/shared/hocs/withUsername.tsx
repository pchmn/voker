import { useAppSelector } from '@core/store/hooks';
import { useFirebase } from '@core/useFirebase/useFirebase';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { AnimatePresence } from 'framer-motion';
import { FlexItem, FlexLayout, MountTransition } from 'la-danze-ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function UsernameForm({ isCreation }: { isCreation: boolean }): JSX.Element {
  const { t } = useTranslation();
  const { setUsername } = useFirebase();
  const [usernameValue, setUsernameValue] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setPending(true);
    event.preventDefault();
    await setUsername(usernameValue);
    setPending(false);
  };

  return (
    <FlexLayout fullHeight flexDirection="column" alignItems="center" justifyContent="center">
      <Grid container justifyContent="center">
        <Grid item xs={10} md={4}>
          <Typography variant="h5" style={{ marginBottom: '2rem' }}>
            {t(isCreation ? 'withUsername.titleCreation' : 'withUsername.titleJoining')}
          </Typography>
          <form onSubmit={handleSubmit}>
            <FlexLayout flexDirection="row">
              <FlexItem flexGrow={1}>
                <TextField
                  label={t('withUsername.chooseUsername')}
                  value={usernameValue}
                  onChange={(event) => setUsernameValue(event.target.value)}
                  disabled={pending}
                />
              </FlexItem>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={!usernameValue}
                pending={pending}
                style={{ marginLeft: '2rem' }}
              >
                {t('common.validate')}
              </LoadingButton>
            </FlexLayout>
          </form>
        </Grid>
      </Grid>
    </FlexLayout>
  );
}

export function withUsername(Component: React.ElementType, isCreation: boolean) {
  return function Render(): JSX.Element {
    const currentUser = useAppSelector((state) => state.auth.value.currentUser);
    return (
      <>
        {!currentUser?.username ? (
          <UsernameForm isCreation={isCreation} />
        ) : (
          <AnimatePresence>
            <MountTransition fullHeight animationType="scale">
              <Component />
            </MountTransition>
          </AnimatePresence>
        )}
      </>
    );
  };
}
