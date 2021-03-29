import { useFirebase } from '@core/useFirebase/useFirebase';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { FlexLayout } from 'la-danze-ui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

export function withJoiningRoom(Component: React.ElementType) {
  return function Render(): JSX.Element {
    const { roomId } = useParams<{ roomId: string }>();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [roomNotFoundError, setRoomNotFoundError] = useState(false);
    const { joinRoom } = useFirebase(roomId);

    useEffect(() => {
      async function joinRoomAsync() {
        await joinRoom().catch(() => setRoomNotFoundError(true));
        setLoading(false);
      }

      joinRoomAsync();
    }, []);

    if (!loading && !roomNotFoundError) {
      return <Component />;
    }

    return (
      <FlexLayout fullHeight flexDirection="column" alignItems="center" justifyContent="center">
        {loading ? (
          <>
            <Typography variant="body1" style={{ marginBottom: '2rem' }}>
              {t('withJoiningRoom.loading')}
            </Typography>
            <CircularProgress color="secondary" />
          </>
        ) : (
          <RoomNotFoundError />
        )}
      </FlexLayout>
    );
  };
}

function RoomNotFoundError(): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <FlexLayout flexDirection="column" alignItems="center" justifyContent="center" style={{ padding: '2rem' }}>
      <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛔</span>
      <Typography variant="h5" style={{ marginBottom: '2rem' }}>
        {t('errors.roomNotFound')}
      </Typography>
      <Button variant="contained" onClick={() => history.push('/')}>
        {t('common.goToHome')}
      </Button>
    </FlexLayout>
  );
}
