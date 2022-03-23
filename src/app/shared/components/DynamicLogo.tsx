import { MantineNumberSize, useMantineTheme } from '@mantine/core';
import React from 'react';

const sizes = {
  xs: 38,
  sm: 48,
  md: 58,
  lg: 78,
  xl: 110
};

export function DynamicLogo({
  size = 'md',
  className,
  onAnimationEnd
}: {
  size?: MantineNumberSize;
  className?: string;
  onAnimationEnd?: React.AnimationEventHandler<SVGElement>;
}) {
  const theme = useMantineTheme();
  const iconSize = theme.fn.size({ size, sizes });

  return (
    <div
      style={{
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        minHeight: iconSize,
        display: 'flex'
      }}
    >
      <svg
        className={className}
        viewBox="0 0 449 338"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onAnimationEnd={onAnimationEnd}
      >
        <g filter="url(#filter0_d_6_3)">
          <rect
            className="card"
            y="131"
            width="185"
            height="290"
            rx="17"
            transform="rotate(-45 0 131)"
            fill={theme.colors[theme.primaryColor][9]}
          />
        </g>
        <g filter="url(#filter1_d_6_3)">
          <rect
            x="318.061"
            width="185"
            height="290"
            rx="17"
            transform="rotate(45 318.061 0)"
            fill={theme.colors[theme.primaryColor][5]}
          />
        </g>
        <defs>
          <filter
            id="filter0_d_6_3"
            x="3.04163"
            y="7.22687"
            width="329.792"
            height="329.792"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6_3" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6_3" result="shape" />
          </filter>
          <filter
            id="filter1_d_6_3"
            x="116.042"
            y="7.04163"
            width="329.792"
            height="329.792"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6_3" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6_3" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
