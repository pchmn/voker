import { AnimatedRoute } from '@lib/ui';
import { DefaultGenerics, Route } from '@tanstack/react-location';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React from 'react';
import RoomPage from './pages/RoomPage';

async function getCurrentUsername() {
  const user = getAuth().currentUser;
  return (await getDoc(doc(getFirestore(), `users/${user?.uid}`))).data()?.username;
}

export const roomRoutes: Route<DefaultGenerics> = {
  path: 'room/:roomId',
  loader: async () => ({
    username: await getCurrentUsername()
  }),
  element: (
    <AnimatedRoute>
      <RoomPage />
    </AnimatedRoute>
  )
};
