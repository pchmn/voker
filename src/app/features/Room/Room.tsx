import { useAppSelector } from '@core/store/hooks';
import { RoomRole } from '@core/useFirebase/models';
import { useFirebase } from '@core/useFirebase/useFirebase';
import { Actions } from '@features/Room/Actions/Actions';
import { Cards } from '@features/Room/Cards/Cards';
import { Members } from '@features/Room/Members/Members';
import { VotingChart } from '@features/Room/VotingChart/VotingChart';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withJoiningRoom } from '@shared/hocs/withJoiningRoom';
import { withUsername } from '@shared/hocs/withUsername';
import { FlexLayout } from 'la-danze-ui';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './Room.scss';

function RoomComponent(): JSX.Element {
  const { roomId } = useParams<{ roomId: string }>();
  const { online, leaveRoom, watchRoom, unwatchRoom } = useFirebase(roomId);
  const history = useHistory();
  const currentRoom = useAppSelector((state) => state.room.value);

  useEffect(() => {
    watchRoom();
    online();
    window.onbeforeunload = () => {
      leaveRoom();
    };

    return () => {
      unwatchRoom();
      leaveRoom();
    };
  }, [roomId]);

  return (
    <div className="Room">
      <FlexLayout justifyContent="center">
        <Typography className="titleVotingPoker" variant="h4" onClick={() => history.push('/')}>
          <strong>Vo</strong>ting Po<strong>ker</strong>
        </Typography>
      </FlexLayout>
      <Grid container justifyContent="center">
        <Grid item lg={8} md={10} xs={12}>
          <Grid container justifyContent="center" spacing={4}>
            <Grid item lg={3} md={3} xs={10}>
              <Members />
            </Grid>
            <Grid item lg={6} md={6} xs={10}>
              {currentRoom.currentVoting?.isOpen ? <Cards /> : <VotingChart />}
            </Grid>
            <Grid item lg={3} md={3} xs={10} className="actions">
              {currentRoom.currentRole === RoomRole.Moderator && <Actions />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export const Room = withUsername(withJoiningRoom(RoomComponent), false) as React.ElementType;
