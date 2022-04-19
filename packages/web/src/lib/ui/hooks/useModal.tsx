import { Modal, ModalProps } from '@mantine/core';
import React, { useState } from 'react';

type OnCloseProps = { onClose(): void };
type ModalOptions = Pick<ModalProps, 'size' | 'title'>;

export function useModal<T extends OnCloseProps>(
  Component: React.ComponentType<T>,
  componentProps?: Omit<T, 'onClose'>,
  options: ModalOptions = { title: '', size: 'md' }
) {
  const [opened, setOpened] = useState(false);
  if (!options.size) {
    options.size = 'md';
  }

  const toggle = () => setOpened(!opened);

  const ModalComponent = () => (
    <Modal size={options.size} opened={opened} onClose={toggle} title={options.title}>
      <Component {...(componentProps as T)} onClose={toggle} />
    </Modal>
  );

  return { Modal: ModalComponent, toggle };
}
