import { useAppSelector } from '@core/store/hooks';
import { useFirebase } from '@core/useFirebase/useFirebase';
import useTheme from '@material-ui/core/styles/useTheme';
import SvgIcon from '@material-ui/core/SvgIcon';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { FlexLayout } from 'la-danze-ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function Actions(): JSX.Element {
  const { roomId } = useParams<{ roomId: string }>();
  const { t } = useTranslation();
  const { closeVoting, createNewVoting } = useFirebase(roomId);
  const currentVoting = useAppSelector((state) => state.room.value.currentVoting);
  const [pending, setPending] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const handleCloseVoting = async () => {
    if (currentVoting) {
      setPending(true);
      await closeVoting(currentVoting.votingId);
      setPending(false);
    }
  };

  const handleNextVoting = async () => {
    setPending(true);
    await createNewVoting();
    setPending(false);
  };

  return (
    <FlexLayout flexDirection="column" alignItems={`${matches ? 'center' : 'flex-end'}`}>
      <LoadingButton
        variant="outlined"
        color="secondary"
        pending={pending}
        onClick={handleCloseVoting}
        disabled={!currentVoting?.isOpen}
        startIcon={
          <SvgIcon>
            {/* <path d="M19.04 4.55l-1.42 1.42C16.07 4.74 14.12 4 12 4c-1.83 0-3.53.55-4.95 1.48l1.46 1.46C9.53 6.35 10.73 6 12 6c3.87 0 7 3.13 7 7 0 1.27-.35 2.47-.94 3.49l1.45 1.45C20.45 16.53 21 14.83 21 13c0-2.12-.74-4.07-1.97-5.61l1.42-1.42-1.41-1.42zM15 1H9v2h6V1zm-4 8.44l2 2V8h-2v1.44zM3.02 4L1.75 5.27 4.5 8.03C3.55 9.45 3 11.16 3 13c0 4.97 4.02 9 9 9 1.84 0 3.55-.55 4.98-1.5l2.5 2.5 1.27-1.27-7.71-7.71L3.02 4zM12 20c-3.87 0-7-3.13-7-7 0-1.28.35-2.48.95-3.52l9.56 9.56c-1.03.61-2.23.96-3.51.96z" /> */}
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
          </SvgIcon>
        }
      >
        {t('room.actions.finishVoting')}
      </LoadingButton>
      <LoadingButton
        variant="outlined"
        color="secondary"
        pending={pending}
        disabled={currentVoting?.isOpen}
        style={{ marginTop: '1rem' }}
        onClick={handleNextVoting}
        endIcon={
          <SvgIcon>
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </SvgIcon>
        }
      >
        {t('room.actions.nextVoting')}
      </LoadingButton>
    </FlexLayout>
  );
}
