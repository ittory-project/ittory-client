import { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import bg1 from '../../../public/assets/connect/bg1.png';
import bg2 from '../../../public/assets/connect/bg2.png';
import bg3 from '../../../public/assets/connect/bg3.png';
import bg4 from '../../../public/assets/connect/bg4.png';
import bg5 from '../../../public/assets/connect/bg5.png';
import '../../App.css';
import { clearData, clearOrderData } from '../../api/config/state';

const scaleAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(25);
  }
`;

const hideDuringAnimation = keyframes`
  0%{
    opacity: 1;
  }
  30%, 60%, 100%  {
    opacity: 0; 
  }
`;

export const Connection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const letterId = location.state.letterId;
  const coverId = location.state.coverId;

  const [topBackground, setTopBackground] = useState<string | null>(
    location.state.bg || null,
  );

  useEffect(() => {
    localStorage.removeItem('letterId');
    dispatch(clearOrderData());
    dispatch(clearData());
    window.localStorage.setItem('nowLetterId', '1');
    window.localStorage.setItem('nowSequence', '1');
    window.localStorage.setItem('nowRepeat', '1');
    window.localStorage.setItem('totalItem', '1');
    window.localStorage.setItem('resetTime', '');
  }, []);

  useEffect(() => {
    const routingTimer = setTimeout(() => {
      navigate(`/write/${letterId}`);
    }, 2500);

    return () => clearTimeout(routingTimer);
  }, [navigate, letterId]);

  useEffect(() => {
    if (!topBackground) {
      switch (coverId) {
        case 1:
          setTopBackground(bg1);
          break;
        case 2:
          setTopBackground(bg2);
          break;
        case 3:
          setTopBackground(bg3);
          break;
        case 4:
          setTopBackground(bg4);
          break;
        case 5:
          setTopBackground(bg5);
          break;
      }
    }
  }, []);

  useEffect(() => {
    if (topBackground) {
      const img = new Image();
      img.src = topBackground;
    }
  }, [topBackground]);

  return (
    <>
      {topBackground && (
        <BackGround topBackground={topBackground}>
          <Contents>편지 쓰러 가는 중 . . .</Contents>
        </BackGround>
      )}
    </>
  );
};

const BackGround = styled.div<{ topBackground: string | null }>`
  position: absolute;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  overflow: hidden;

  background-image: url(${(props) => props.topBackground});
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  background-position: center; /* 중앙 정렬 */
  background-size: cover;

  animation: ${scaleAnimation} 1s ease-in-out;
  animation-delay: 1.6s;
`;

const Contents = styled.div`
  position: absolute;
  z-index: 2;

  display: inline-flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: var(--Border-Radius-radius_300, 8px) 16px;
  margin-top: 55%;

  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 20px;

  color: #fff;

  text-align: center;
  letter-spacing: -0.5px;

  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  animation: ${hideDuringAnimation} 2s ease-in-out;
  animation-delay: 1s;
`;
