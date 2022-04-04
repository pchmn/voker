import { useRouter } from '@tanstack/react-location';
import { AnimatePresence, motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';

const variants = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.61, 1, 0.88, 1]
    }
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.61, 1, 0.88, 1]
    }
  }
};

export function AnimatedRoute({ children }: PropsWithChildren<unknown>) {
  const router = useRouter();
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div key={router.state.location.key} {...variants} style={{ height: '100%' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
