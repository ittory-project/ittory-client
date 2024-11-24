import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import img from '../../../public/assets/location.svg';

interface LocationProps {
  progressTime: number;
  name: string;
  profileImage: string | undefined;
}

// 위치 컴포넌트
export const WriteLocation: React.FC<LocationProps> = ({ progressTime, name, profileImage }) => {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progressTime / 100);
  const isWarning = progressTime <= 10;

  return (
    <Background>
      <Profile profileImage={profileImage}>
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
              stroke={isWarning ? '#FFA256' : 'white'}
              strokeWidth="3"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={-offset} 
              transform="rotate(-90 28 28)" 
            />
          </Svg>
          <Name
            color={isWarning ? '#FFA256' : 'white'} 
          >
            {name}
          </Name>
        </Contents>
      </Profile>
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

const Profile = styled.div<{ profileImage: string | undefined }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 4px 0 0 0;
  background-image: url(${({ profileImage }) => profileImage});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  padding: 8px; 
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 28px;
  background: rgba(6, 13, 36, 0.8);
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
