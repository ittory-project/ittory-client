import React, { useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import img from '../../../public/assets/location.svg';

interface LocationProps {
  progressTime: number;
  name: string;
  profileImage: string | undefined;
}

// 위치 컴포넌트
export const WriteLocation: React.FC<LocationProps> = ({
  progressTime,
  name,
  profileImage,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 850);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const circleRef = useRef<SVGCircleElement>(null);

  const radius = 25;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      const offset = isMobile
        ? (circumference * progressTime) / 100
        : -(circumference * (1 - progressTime / 100));
      // const offset = circumference * (1 - progressTime / 100);
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [progressTime, circumference]);

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
              ref={circleRef}
              cx="28"
              cy="28"
              r={radius}
              stroke={isWarning ? '#FFA256' : 'white'}
              strokeWidth="3"
              fill="none"
              strokeDasharray={circumference}
              transform="rotate(-90 28 28)"
            />
          </Svg>
          <Name color={isWarning ? '#FFA256' : 'white'}>{name}</Name>
        </Contents>
      </Profile>
    </Background>
  );
};

const Background = styled.div`
  display: flex;
  justify-content: center;
  width: 66px;
  height: 82px;
  background-image: url(${img});
  background-size: cover;
`;

const Profile = styled.div<{ profileImage: string | undefined }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 4px 0 0 0;
  background-image: url(${({ profileImage }) =>
    profileImage ? profileImage : '/assets/common/profile_bunny.svg'});
  background-position: center;
  background-size: cover;
  border-radius: 50%;
`;

const Contents = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 8px;
  background: rgba(6, 13, 36, 0.8);
  border-radius: 28px;
`;

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
`;

const Circle = styled.circle`
  transition:
    stroke-dashoffset 0.1s linear,
    stroke 0.1s linear;
`;

const Name = styled.div<{ color: string }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 34px;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-2xs, 11px);
  font-style: bold;
  font-weight: 400;
  line-height: var(--Typography-line_height-2xs, 16px); /* 145.455% */
  color: ${({ color }) => color};
  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;
