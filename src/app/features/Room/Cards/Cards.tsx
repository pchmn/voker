import { RoomRole, VoteValue, Voting } from '@core/useFirebase/models';
import { useFirebase } from '@core/useFirebase/useFirebase';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import useTheme from '@material-ui/core/styles/useTheme';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { FlexLayout } from 'la-danze-ui';
import React, { useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';
import './Cards.scss';

createStore('cardSelected', null);

function VotingCard({ value }: { value: VoteValue }): JSX.Element {
  const { roomId } = useParams<{ roomId: string }>();
  const { vote, currentUser } = useFirebase(roomId);
  const [cardSelected, setCardSelected] = useStore('cardSelected');
  const [currentVoting] = useStore<Voting>('currentVoting');
  const [currentRole] = useStore<RoomRole>('currentRole');

  useEffect(() => {
    if (currentVoting && currentUser) {
      setCardSelected(currentVoting.votes ? currentVoting.votes[currentUser.uid] : null);
    }
  }, [currentVoting, currentUser, setCardSelected]);

  useEffect(() => {
    if (currentRole === RoomRole.Viewer) {
      setCardSelected(null);
    }
  }, [currentRole, setCardSelected]);

  const handleVote = (value: VoteValue) => {
    if (currentRole !== RoomRole.Viewer) {
      invariant(currentVoting, 'No current voting');
      setCardSelected(cardSelected !== value ? value : null);
      vote(currentVoting.votingId, cardSelected !== value ? value : null);
    }
  };

  return (
    <Grid item xs={3}>
      <Card className={`VotingCard ${cardSelected === value ? 'selected' : ''}`} onClick={() => handleVote(value)}>
        <ButtonBase className="button" disabled={currentRole === RoomRole.Viewer}>
          <FlexLayout alignItems="center" justifyContent="center">
            <Typography variant="h4">{value}</Typography>
          </FlexLayout>
        </ButtonBase>
      </Card>
    </Grid>
  );
}

const votingValues: VoteValue[] = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?'];

export function Cards(): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className="Cards">
      <Grid container spacing={matches ? 1 : 2}>
        {votingValues.map((item, index) => (
          <VotingCard key={index} value={item} />
        ))}
      </Grid>
    </div>
  );
}
