import { RoomRole, Voting } from '@core/useFirebase/models';
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
import { createStore, useStore } from 'react-hookstore';
import { useHistory, useParams } from 'react-router-dom';
import './Room.scss';

createStore('currentVoting', null);
createStore('currentRole', null);

function RoomComponent(): JSX.Element {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    currentUser,
    watchRoomMembers,
    unwatchRoomMembers,
    watchVotings,
    unwatchVotings,
    online,
    leaveRoom,
    memberList,
    votingList
  } = useFirebase(roomId);
  const [currentVoting, setCurrentVoting] = useStore<Voting>('currentVoting');
  const [currentRole, setCurrentRole] = useStore<RoomRole>('currentRole');
  const history = useHistory();

  useEffect(() => {
    watchRoom();

    return () => unwatchRoom();
  }, [roomId]);

  useEffect(() => {
    getCurrentVoting();
  }, [votingList]);

  useEffect(() => {
    checkCurrentRole();
  }, [memberList]);

  const watchRoom = () => {
    online();
    watchRoomMembers();
    watchVotings();

    window.onbeforeunload = () => {
      leaveRoom();
    };
  };

  const unwatchRoom = () => {
    console.log('unwatch');
    unwatchRoomMembers();
    unwatchVotings();
    leaveRoom();
  };

  const getCurrentVoting = () => {
    if (votingList?.length > 0) {
      setCurrentVoting(
        votingList.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())[0]
      );
    }
  };

  const checkCurrentRole = () => {
    if (memberList?.length > 0) {
      const me = memberList.find((item) => item.uid === currentUser?.uid);
      if (me) {
        setCurrentRole(me.role);
      }
    }
  };

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
              <Members memberList={memberList} />
            </Grid>
            <Grid item lg={6} md={6} xs={10}>
              {currentVoting?.isOpen ? <Cards /> : <VotingChart />}
            </Grid>
            <Grid item lg={3} md={3} xs={10} className="actions">
              {currentRole === RoomRole.Moderator && <Actions />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export const Room = withUsername(withJoiningRoom(RoomComponent), false) as React.ElementType;
