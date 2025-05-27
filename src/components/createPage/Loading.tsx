import Player from 'lottie-react';
import styled from 'styled-components';

import animation from '@/assets/loading.json';

export const Loading = () => {
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

  background: linear-gradient(
    180deg,
    #d3edff 0%,
    #e7f6f7 46.2%,
    #feffee 97.27%
  );

  background-blend-mode: overlay, normal;

  transform: translateX(-50%);
`;
