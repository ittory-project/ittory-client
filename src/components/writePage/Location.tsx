import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import img from '../../../public/assets/location.svg';

interface LocationProps {
  name: string;
}

export const Location: React.FC<LocationProps> = ({ name }) => {
  const [progress, setProgress] = useState(100); // Progress in percentage

  useEffect(() => {
    const totalDuration = 100000; // Total duration in milliseconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, totalDuration / 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100); // Calculate the offset to simulate disappearance

  // Define color based on the remaining time
  const isWarning = progress <= 10; // True if 10 seconds or less are left

  return (
    <Background>
      <Contents>
        <Svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Circle
            cx="28"
            cy="28"
            r={radius}
            stroke={isWarning ? '#FFA256' : 'white'} // Change color based on time
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={-offset} // Adjust for the effect to be shrinking
            transform="rotate(-90 28 28)" // Rotate to start from the top
          />
        </Svg>
        <Name
          color={isWarning ? '#FFA256' : 'white'} // Change color based on time
        >
          {name}
        </Name>
      </Contents>
    </Background>
  );
};

const Background = styled.div`
  width: 66px;
  height: 82px;
  display: flex;
  justify-content: center;
  background-image: url(${img});
  background-size: cover;
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3px 0 0 0;
  width: 56px;
  height: 56px;
  padding: 8px; /* Adjust padding for better fit */
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 28px;
  background: var(--Color-secondary-dark_navy_blue, #060D24);
  position: relative;
`;

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
`;

const Circle = styled.circle`
  transition: stroke-dashoffset 0.1s linear, stroke 0.1s linear;
`;

const Name = styled.div<{ color: string }>`
  display: flex;
  width: 36px;
  height: 34px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: ${({ color }) => color};
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-2xs, 11px);
  font-style: bold;
  font-weight: 400;
  line-height: var(--Typography-line_height-2xs, 16px); /* 145.455% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  position: relative;
  z-index: 1;
`;
