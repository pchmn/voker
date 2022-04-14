import React from 'react';
import { Room } from '../components/Room';
import { withUsername } from '../hoc/withUsername';

function RoomPage() {
  return <Room />;
}

export default withUsername(RoomPage);
