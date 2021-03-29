import { useFirebase } from '@core/useFirebase/useFirebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { withUsername } from '@shared/hocs/withUsername';
import { FlexLayout } from 'la-danze-ui';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

function CreatingRoomComponent(): JSX.Element {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { createNewRoom } = useFirebase();
  const history = useHistory();

  useEffect(() => {
    async function createRoom() {
      const roomId = await createNewRoom();
      history.push(`/room/${roomId}`);
      setLoading(false);
    }

    createRoom();
  }, []);

  return (
    <>
      {loading && (
        <FlexLayout fullHeight flexDirection="column" alignItems="center" justifyContent="center">
          <Typography variant="body1" style={{ marginBottom: '2rem' }}>
            {t('creatingRoom.loading')}
          </Typography>
          <CircularProgress color="secondary" />
        </FlexLayout>
      )}
    </>
  );
}

export const CreatingRoom = withUsername(CreatingRoomComponent, true) as React.ElementType;
