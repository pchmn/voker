import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { FlexLayout } from 'la-danze-ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

export function Home(): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory();
  const [openDialog, setOpenDialog] = useState(false);
  const [roomIdValue, setRoomIdValue] = useState('');

  const handleCreateNewRoom = () => {
    history.push('/creating-room');
  };

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    history.push(`/room/${roomIdValue}`);
  };

  return (
    <>
      <FlexLayout fullHeight flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="h2">
          <strong>Vo</strong>ting Po<strong>ker</strong>
        </Typography>
        <div style={{ marginTop: '3rem' }}>
          <Button variant="contained" size="large" onClick={handleCreateNewRoom}>
            {t('home.createNewRoom')}
          </Button>
          <Button size="large" style={{ marginLeft: '1rem' }} onClick={handleOpenDialog}>
            {t('home.joinARoom')}
          </Button>
        </div>
      </FlexLayout>

      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="simple-dialog-title">
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          <TextField
            label={t('home.roomId')}
            value={roomIdValue}
            onChange={(event) => setRoomIdValue(event.target.value)}
          />
          <Button
            variant="contained"
            style={{ marginTop: '2rem', width: '100%' }}
            disabled={!roomIdValue}
            type="submit"
          >
            {t('home.joinRoom')}
          </Button>
        </form>
      </Dialog>
    </>
  );
}
