import { RoomMember, RoomRole, Voting } from '@core/useFirebase/models';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoomState {
  memberList: RoomMember[];
  votingList: Voting[];
  currentVoting?: Voting;
  currentRole?: RoomRole;
}
const initialStateRoom: { value: RoomState } = { value: { votingList: [], memberList: [] } };

export const roomSlice = createSlice({
  name: 'room',
  initialState: initialStateRoom,
  reducers: {
    setVotingList: (state, action: PayloadAction<Voting[]>) => {
      state.value.votingList = action.payload;
    },
    addVoting: (state, action: PayloadAction<Voting>) => {
      if (!state.value.votingList.find((item) => item.votingId === action.payload.votingId)) {
        state.value.votingList.push(action.payload);
      }
    },
    removeVoting: (state, action: PayloadAction<Voting>) => {
      state.value.votingList.filter((item) => item.votingId !== action.payload.votingId);
    },
    setCurrentVoting: (state, action: PayloadAction<Voting>) => {
      state.value.currentVoting = action.payload;
    },
    updateVoting: (state, action: PayloadAction<Voting>) => {
      const votingToUpdate = state.value.votingList.find((item) => item.votingId === action.payload.votingId);
      if (votingToUpdate) {
        votingToUpdate.isOpen = action.payload.isOpen;
        votingToUpdate.votes = action.payload.votes;
      }
    },
    resetVotingList: (state) => {
      state.value.votingList = [];
    },
    setMemberList: (state, action: PayloadAction<RoomMember[]>) => {
      state.value.memberList = action.payload;
    },
    addMember: (state, action: PayloadAction<RoomMember>) => {
      if (!state.value.memberList.find((item) => item.uid === action.payload.uid)) {
        state.value.memberList.push(action.payload);
      }
    },
    updateMember: (state, action: PayloadAction<RoomMember>) => {
      const memberToUpdate = state.value.memberList.find((item) => item.uid === action.payload.uid);
      if (memberToUpdate) {
        memberToUpdate.hasVoted = action.payload.hasVoted;
        memberToUpdate.isOnline = action.payload.isOnline;
        memberToUpdate.role = action.payload.role;
        memberToUpdate.username = action.payload.username;
      }
    },
    setCurrentRole: (state, action: PayloadAction<RoomRole>) => {
      state.value.currentRole = action.payload;
    }
  }
});

export const {
  setVotingList,
  addVoting,
  removeVoting,
  setCurrentVoting,
  resetVotingList,
  setMemberList,
  addMember,
  updateMember,
  updateVoting,
  setCurrentRole
} = roomSlice.actions;
