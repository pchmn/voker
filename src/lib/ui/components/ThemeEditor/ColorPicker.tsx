import { Icon, useThemeColors, useThemeSettings } from '@lib/ui';
import { createStyles, Group, MantineColor } from '@mantine/core';
import React from 'react';

export function ColorPicker() {
  const { setPrimaryColor } = useThemeSettings();
  const { colors, primaryColor } = useThemeColors();

  return (
    <Group position="center">
      {colors.map((color) => (
        <ColorItem key={color} color={color} isSelected={primaryColor === color} onClick={setPrimaryColor} />
      ))}
    </Group>
  );
}

function ColorItem({
  color,
  isSelected,
  onClick
}: {
  color: MantineColor;
  isSelected: boolean;
  onClick: (color: MantineColor) => void;
}) {
  const { classes } = createStyles((theme) => {
    return {
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '35px',
        width: '35px',
        backgroundColor: theme.colors[color][5],
        boxShadow: `0 0 0 3px ${isSelected ? theme.colors[color][2] : 'transparent'}`,
        borderRadius: '100%',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: theme.colors[color][4]
        }
      }
    };
  })();

  return (
    <div className={classes.container} onClick={() => onClick(color)}>
      {isSelected && (
        <Icon size="sm" color="#fff">
          <CheckIcon />
        </Icon>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
      <path
        d="M5 12l5 5L20 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
