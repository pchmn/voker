import { Errors } from '@core/errors/errors';
import { setCurrentUser } from '@core/store/authSlice';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import {
  addMember,
  addVoting,
  setCurrentRole,
  setCurrentVoting,
  updateMember,
  updateVoting
} from '@core/store/roomSlice';
import { setCriticError, setError } from '@core/store/snackbarMessageSlice';
import { FirebaseUser, RoomMember, RoomRole, VoteValue, Voting } from '@core/useFirebase/models';
import firebase from 'firebase';
import { useTranslation } from 'react-i18next';
import invariant from 'tiny-invariant';

export interface UseFirebase {
  authenticate: () => Promise<void>;
  setUsername: (username: string) => Promise<void>;
  createNewRoom: () => Promise<string | undefined>;
  joinRoom: (role?: RoomRole, roomIdParam?: string) => Promise<void>;
  online: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  createNewVoting: (creationDate?: Date | undefined) => Promise<void>;
  vote: (votingId: string, value: VoteValue | null) => Promise<void>;
  closeVoting: (votingId: string) => Promise<void>;
  setRole: (votingId: string, uid: string, role: RoomRole) => Promise<void>;
  watchRoom: () => void;
  unwatchRoom: () => void;
}

export function useFirebase(roomId?: string): UseFirebase {
  const { t } = useTranslation();
  const currentUser = useAppSelector((state) => state.auth.value.currentUser);
  const dispatch = useAppDispatch();

  const authenticate = async () => {
    const userCredentials = await firebase.auth().signInAnonymously();
    invariant(userCredentials.user, Errors.AuthError);
    // invariant(false, Errors.AuthError);
    const user = await getUser(userCredentials.user.uid);
    dispatch(setCurrentUser(user));
  };

  const setUsername = async (username: string) => {
    invariant(currentUser, Errors.UnknownError);
    await firebase.database().ref(`/users/${currentUser?.uid}`).set(username);
    dispatch(setCurrentUser({ ...currentUser, username: username }));
  };

  const createNewRoom = async () => {
    invariant(currentUser, Errors.UnknownError);
    roomId = firebase.database().ref().child('rooms').push().key || undefined;
    invariant(roomId, 'Error when creating new room');
    const creationDate = new Date();
    const updates: any = {};
    updates[`/rooms/${roomId}`] = { creationDate: creationDate.toISOString() };
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
      await firebase
        .database()
        .ref(`/members/${roomIdParam || roomId}/${currentUser.uid}`)
        .set({
          role: role ? role : RoomRole.Voter,
          isOnline: true,
          hasVoted: false
        });
    }
  };

  const online = async () => {
    invariant(currentUser, Errors.UnknownError);
    await firebase.database().ref(`/members/${roomId}/${currentUser.uid}/isOnline`).set(true);
  };

  const leaveRoom = async () => {
    invariant(currentUser, Errors.UnknownError);
    await firebase.database().ref(`/members/${roomId}/${currentUser.uid}/isOnline`).set(false);
  };

  const createNewVoting = async (creationDate = new Date()) => {
    invariant(currentUser, Errors.UnknownError);
    const newVotingId = firebase.database().ref().child(`/votings/${roomId}`).push().key;
    invariant(newVotingId, 'Error when creating new voting');
    const membersSnapshot = await firebase.database().ref(`/members/${roomId}`).get();
    const updates: any = {};
    membersSnapshot.forEach((child) => {
      updates[`/members/${roomId}/${child.key}/hasVoted`] = false;
    });
    await firebase.database().ref().update(updates);
    updates[`/votings/${roomId}/${newVotingId}`] = { creationDate: creationDate.toISOString(), isOpen: true };
    await firebase.database().ref().update(updates);
  };

  const vote = async (votingId: string, value: VoteValue | null) => {
    invariant(currentUser, Errors.UnknownError);
    const updates: any = {};
    updates[`/votings/${roomId}/${votingId}/votes/${currentUser.uid}`] = value;
    updates[`/members/${roomId}/${currentUser.uid}/hasVoted`] = value ? true : false;
    updates[`/members/${roomId}/${currentUser.uid}/isOnline`] = true;
    await firebase.database().ref().update(updates);
  };

  const closeVoting = async (votingId: string) => {
    console.log('closevoting', votingId);
    invariant(currentUser, Errors.UnknownError);
    await firebase.database().ref(`/votings/${roomId}/${votingId}/isOpen`).set(false);
  };

  const watchRoom = () => {
    // Members
    const membersRef = firebase.database().ref(`/members/${roomId}`);
    membersRef.on('child_added', async (snapshot) => {
      if (snapshot.key) {
        dispatch(addMember(await loadMember(snapshot.key, snapshot.val())));
        if (snapshot.key === currentUser?.uid) {
          dispatch(setCurrentRole(snapshot.val().role));
        }
      }
    });
    membersRef.on('child_changed', async (snapshot) => {
      if (snapshot.key) {
        dispatch(updateMember(await loadMember(snapshot.key, snapshot.val())));
        if (snapshot.key === currentUser?.uid) {
          dispatch(setCurrentRole(snapshot.val().role));
        }
      }
    });
    // Votings
    const votingsRef = firebase.database().ref(`/votings/${roomId}`);
    votingsRef.on('child_added', (snapshot) => {
      dispatch(addVoting({ ...snapshot.val(), votingId: snapshot.key }));
      dispatch(setCurrentVoting({ ...snapshot.val(), votingId: snapshot.key }));
    });
    votingsRef.on('child_changed', (snapshot) => {
      dispatch(updateVoting({ ...snapshot.val(), votingId: snapshot.key }));
      dispatch(setCurrentVoting({ ...snapshot.val(), votingId: snapshot.key }));
    });
  };

  const unwatchRoom = () => {
    // Votings
    firebase.database().ref(`/votings/${roomId}`).off();
    // Members
    firebase.database().ref(`/members/${roomId}`).off();
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

  const handleError = (err: any) => {
    if (err.message && err.message.includes('Invariant failed')) {
      const errorMsg = err.message.split('Invariant failed: ')[1];
      if (errorMsg === Errors.AuthError) {
        dispatch(setCriticError(t(errorMsg)));
      } else {
        dispatch(setError(t(errorMsg)));
      }
    } else {
      dispatch(setError(t(Errors.UnknownError)));
    }
  };

  return {
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
    closeVoting: (votingId: string) =>
      closeVoting(votingId).catch((err) => {
        console.log('err closeVoting', err);
        handleError(err);
      }),
    setRole: (votingId: string, uid: string, role: RoomRole) =>
      setRole(votingId, uid, role).catch((err) => handleError(err)),
    watchRoom,
    unwatchRoom
  };
}

async function getUser(uid: string): Promise<FirebaseUser> {
  const username = (await firebase.database().ref(`/users/${uid}`).get()).val();
  return { username, uid };
}

async function loadMember(
  uid: string,
  memberData: { role: RoomRole; isOnline: boolean; hasVoted: boolean }
): Promise<RoomMember> {
  return { ...(await getUser(uid)), ...memberData };
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
    votingList.push({ ...votingsData[key], votingId: key });
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
