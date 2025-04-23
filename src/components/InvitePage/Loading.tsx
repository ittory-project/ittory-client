import React, { useEffect } from 'react';

import Player from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import animation from '../../../public/assets/loading.json';

interface Props {
  loadstatus?: boolean;
  setLoad?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Loading = ({ loadstatus }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // 로컬스토리지에서 값 가져오기
    const letterId = Number(localStorage.getItem('letterId'));
    const userName = localStorage.getItem('userName');
    const guideOpen = localStorage.getItem('guideOpen');
    navigate('/Invite', {
      state: { letterId, userName, guideOpen },
    });
  };

  useEffect(() => {
    if (localStorage.getItem('load') === 'done') {
      if (loadstatus === true) {
        fetchData();
      } else {
        localStorage.removeItem('load');
      }
    } else {
      fetchData();
    }
  }, [loadstatus]);

  return (
    <BackGround>
      <Player
        animationData={animation}
        loop
        autoplay
        style={{
          height: '112px',
          width: '200px',
          margin: '0 auto',
        }}
      />
    </BackGround>
  );
};

const BackGround = styled.div`
  position: relative;
  left: 50%;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background:
    100px 100px repeat,
    #d3edff;

  background-blend-mode: overlay, normal;

  transform: translateX(-50%);
`;
