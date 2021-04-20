import { useAppSelector } from '@core/store/hooks';
import styled from '@emotion/styled';
import React, { useEffect, useRef } from 'react';
import styles from './PokerTable.module.scss';

const Table = styled.div(`
  position: relative;
  width: 18rem;
  height: 18rem;
  margin: calc(100px / 2 + 0px);
  &:before {
    
  }
`);

export function PokerTable(): JSX.Element {
  const graph = useRef<HTMLDivElement>(null);
  const currentRoom = useAppSelector((state) => state.room.value);

  useEffect(() => {
    const ciclegraph = graph.current;
    if (ciclegraph) {
      const circleElements = ciclegraph.children;

      let angle = 360 - 90;
      const dangle = 360 / circleElements.length;

      for (let i = 0; i < circleElements.length; i++) {
        const circle = circleElements[i] as HTMLDivElement;
        angle += dangle;
        circle.style.transform = `rotate(${angle}deg) translate(${
          (ciclegraph?.clientWidth + 150) / 2
        }px) rotate(-${angle}deg)`;
      }
    }
  }, [currentRoom.memberList]);

  console.log('currentRoom', currentRoom);

  return (
    <div className={styles.PokerTable}>
      <div className={styles.ciclegraph} ref={graph}>
        {currentRoom.memberList.map((item, index) => (
          <div key={index} className={styles.circle}>
            <div className={styles.card}>{item.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
