import { Center } from '@mantine/core';
import { useMatch } from '@tanstack/react-location';
import React from 'react';

export function Room() {
  const {
    params: { roomId }
  } = useMatch();

  console.log('roomId', roomId);
  return <Center>Hello Room</Center>;
}
