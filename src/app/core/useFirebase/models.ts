export interface FirebaseUser {
  uid: string;
  username?: string;
}

export interface RoomMember extends FirebaseUser {
  role: RoomRole;
  isOnline: boolean;
  hasVoted: boolean;
}

export interface Vote {
  value: VoteValue;
  voter: FirebaseUser;
}

export interface Voting {
  votingId: string;
  isOpen: boolean;
  creationDate: Date;
  votes: { [key: string]: VoteValue | undefined };
}

export enum RoomRole {
  Moderator = 'moderator',
  Viewer = 'viewer',
  Voter = 'voter'
}

export type VoteValue = 0 | 0.5 | 1 | 2 | 3 | 5 | 8 | 13 | 20 | 40 | 100 | '?' | 'coffee';
