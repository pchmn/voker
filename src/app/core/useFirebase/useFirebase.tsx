import { Errors } from '@core/errors/errors';
import { FirebaseUser, RoomMember, RoomRole, Vote, VoteValue, Voting } from '@core/useFirebase/models';
import firebase from 'firebase';
import { useStorage } from 'la-danze-ui';
import { useState } from 'react';
import { useStore } from 'react-hookstore';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

export interface UseFirebase {
  currentUser?: FirebaseUser;
  authenticate: () => Promise<void>;
  setUsername: (username: string) => Promise<void>;
  createNewRoom: () => Promise<string | undefined>;
  joinRoom: (role?: RoomRole, roomIdParam?: string) => Promise<void>;
  online: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  createNewVoting: (creationDate?: Date | undefined) => Promise<void>;
  vote: (votingId: string, value: VoteValue | null) => Promise<void>;
  closeVoting: (votingId: string) => Promise<void>;
  getVotes: (votingId: string) => Promise<Vote[] | undefined>;
  getMyVote: (votingId: string) => Promise<VoteValue | undefined>;
  setRole: (votingId: string, uid: string, role: RoomRole) => Promise<void>;
  watchRoomMembers: () => void;
  unwatchRoomMembers: () => void;
  watchVotings: () => void;
  unwatchVotings: () => void;
  memberList: RoomMember[];
  // currentVoting?: Voting;
  votingList: Voting[];
}

export function useFirebase(roomId?: string): UseFirebase {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useStorage<FirebaseUser>('currentUser');
  const [memberList, setMemberList] = useState<RoomMember[]>([]);
  const [votingList, setVotingList] = useState<Voting[]>([]);
  const [, setCriticError] = useStore<string>('criticError');
  const [, setError] = useStore<string>('error');

  const authenticate = async () => {
    const userCredentials = await firebase.auth().signInAnonymously();
    invariant(userCredentials.user, Errors.AuthError);
    // invariant(false, Errors.AuthError);
    const user = await getUser(userCredentials.user.uid);
    if (!currentUser || currentUser.uid !== userCredentials.user.uid || currentUser.username !== user.username) {
      setCurrentUser(user);
    }
  };

  const setUsername = async (username: string) => {
    invariant(currentUser, Errors.UnknownError);
    const updates: any = {};
    updates[`/users/${currentUser?.uid}`] = username;
    await firebase.database().ref().update(updates);
    setCurrentUser({ ...currentUser, username: username });
  };

  const createNewRoom = async () => {
    invariant(currentUser, Errors.UnknownError);
    roomId = firebase.database().ref().child('rooms').push().key || undefined;
    invariant(roomId, 'Error when creating new room');
    const creationDate = new Date();
    const updates: any = {};
    updates[`/rooms/${roomId}`] = { creationDate };
    updates[`/members/${roomId}/${currentUser.uid}`] = {
      role: RoomRole.Moderator,
      isOnline: true,
      hasVoted: false
    };
    await firebase.database().ref().update(updates);
    await createNewVoting(creationDate);
    return roomId;
  };

  const joinRoom = async (role?: RoomRole, roomIdParam?: string) => {
    invariant(currentUser, Errors.UnknownError);
    invariant(
      (
        await firebase
          .database()
          .ref(`/rooms/${roomIdParam || roomId}`)
          .get()
      ).val(),
      Errors.RoomNotFound
    );
    const alreadyMember = (
      await firebase
        .database()
        .ref(`/members/${roomIdParam || roomId}/${currentUser.uid}`)
        .get()
    ).val();
    if (!alreadyMember) {
      const updates: any = {};
      updates[`/members/${roomIdParam || roomId}/${currentUser.uid}`] = {
        role: role ? role : RoomRole.Voter,
        isOnline: true,
        hasVoted: false
      };
      await firebase.database().ref().update(updates);
    }
  };

  const online = async () => {
    invariant(currentUser, Errors.UnknownError);
    const updates: any = {};
    updates[`/members/${roomId}/${currentUser.uid}/isOnline`] = true;
    await firebase.database().ref().update(updates);
  };

  const leaveRoom = async () => {
    invariant(currentUser, Errors.UnknownError);
    const updates: any = {};
    updates[`/members/${roomId}/${currentUser.uid}/isOnline`] = false;
    await firebase.database().ref().update(updates);
  };

  const createNewVoting = async (creationDate?: Date) => {
    invariant(currentUser, Errors.UnknownError);
    const newVotingId = firebase.database().ref().child(`/votings/${roomId}`).push().key;
    invariant(newVotingId, 'Error when creating new voting');
    const updates: any = {};
    updates[`/votings/${roomId}/${newVotingId}`] = { creationDate: creationDate || new Date(), isOpen: true };
    await firebase.database().ref().update(updates);
  };

  const vote = async (votingId: string, value: VoteValue | null) => {
    invariant(currentUser, Errors.UnknownError);
    const updates: any = {};
    updates[`/votings/${roomId}/${votingId}/votes/${currentUser.uid}`] = value;
    updates[`/members/${roomId}/${currentUser.uid}/hasVoted`] = true;
    updates[`/members/${roomId}/${currentUser.uid}/isOnline`] = true;
    await firebase.database().ref().update(updates);
  };

  const closeVoting = async (votingId: string) => {
    invariant(currentUser, Errors.UnknownError);
    const updates: any = {};
    updates[`/votings/${roomId}/${votingId}/isOpen`] = false;
    await firebase.database().ref().update(updates);
  };

  const getVotes = async (votingId: string) => {
    const votes: Vote[] = [];
    const votesData = (await firebase.database().ref(`/votings/${votingId}/votes`).get()).val();
    for (const key in votesData) {
      votes.push({ value: votesData[key], voter: await getUser(key) });
    }
    return votes;
  };

  const getMyVote = async (votingId: string) => {
    invariant(currentUser, Errors.UnknownError);
    return (await firebase.database().ref(`/votings/${roomId}/${votingId}/votes/${currentUser.uid}`).get()).val();
  };

  const watchVotings = async () => {
    firebase
      .database()
      .ref(`/votings/${roomId}`)
      .on('value', async (snapshot) => {
        setVotingList(getVotingList(snapshot.val()));
      });
  };

  const setRole = async (votingId: string, uid: string, role: RoomRole) => {
    invariant(currentUser, Errors.UnknownError);
    const updates: any = {};
    updates[`/members/${roomId}/${uid}/role`] = role;
    if (role === RoomRole.Viewer) {
      updates[`/votings/${roomId}/${votingId}/votes/${uid}`] = null;
      updates[`/members/${roomId}/${uid}/hasVoted`] = false;
    }
    await firebase.database().ref().update(updates);
  };

  const unwatchVotings = () => {
    firebase.database().ref(`/votings/${roomId}`).off();
  };

  const watchRoomMembers = () => {
    firebase
      .database()
      .ref(`/members/${roomId}`)
      .on('value', async (snapshot) => {
        setMemberList(await loadMembers(memberList, snapshot.val()));
      });
  };

  const unwatchRoomMembers = () => {
    console.log('unwatch');
    firebase.database().ref(`/members/${roomId}`).off();
  };

  const handleError = (err: any) => {
    if (err.message && err.message.includes('Invariant failed')) {
      const errorMsg = err.message.split('Invariant failed: ')[1];
      if (errorMsg === Errors.AuthError) {
        setCriticError(t(errorMsg));
      } else {
        setError(t(errorMsg));
      }
    } else {
      setError(t(Errors.UnknownError));
    }
  };

  return {
    currentUser,
    authenticate: () => authenticate().catch((err) => handleError(err)),
    setUsername: (username: string) => setUsername(username).catch((err) => handleError(err)),
    createNewRoom: () =>
      createNewRoom().catch((err) => {
        handleError(err);
        return undefined;
      }),
    joinRoom,
    online: () => online().catch((err) => handleError(err)),
    leaveRoom: () => leaveRoom().catch((err) => handleError(err)),
    createNewVoting: (creationDate?: Date | undefined) =>
      createNewVoting(creationDate).catch((err) => {
        console.log('error', err);
        handleError(err);
      }),
    vote: (votingId: string, value: VoteValue | null) => vote(votingId, value).catch((err) => handleError(err)),
    closeVoting: (votingId: string) => closeVoting(votingId).catch((err) => handleError(err)),
    getVotes: (votingId: string) =>
      getVotes(votingId).catch((err) => {
        handleError(err);
        return undefined;
      }),
    getMyVote: (votingId: string) =>
      getMyVote(votingId).catch((err) => {
        handleError(err);
        return undefined;
      }),
    setRole: (votingId: string, uid: string, role: RoomRole) =>
      setRole(votingId, uid, role).catch((err) => handleError(err)),
    watchRoomMembers,
    unwatchRoomMembers,
    watchVotings,
    unwatchVotings,
    memberList,
    // currentVoting,
    votingList
  };
}

async function getUser(uid: string): Promise<FirebaseUser> {
  const username = (await firebase.database().ref(`/users/${uid}`).get()).val();
  return { username, uid };
}

async function loadMembers(
  memberList: RoomMember[],
  membersData: { [key: string]: { role: RoomRole; isOnline: boolean; hasVoted: boolean } }
): Promise<RoomMember[]> {
  const loadedMembers = [...memberList];
  for (const key in membersData) {
    const roomMember = { ...(await getUser(key)), ...membersData[key] };
    const memberFound = loadedMembers.find((item) => item.uid === key);
    if (memberFound) {
      memberFound.role = roomMember.role;
      memberFound.uid = roomMember.uid;
      memberFound.username = roomMember.username;
    } else {
      loadedMembers.push(roomMember);
    }
  }
  return loadedMembers;
}

function getVotingList(votingsData: { [key: string]: Voting }): Voting[] {
  const votingList: Voting[] = [];
  for (const key in votingsData) {
    votingList.push({ ...votingsData[key], creationDate: new Date(votingsData[key].creationDate), votingId: key });
  }

  return votingList;

  // if (votingList.length > 0) {
  //   return [
  //     votingList,
  //     votingList.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())[0]
  //   ];
  // }
  // return [votingList, undefined];
}
