import { Suspense, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import logout from '@/assets/logout.svg';
import out from '@/assets/out_X.svg';
import prev from '@/assets/prev.svg';

import { AccountDelete } from './AccountDelete';
import { Logout } from './Logout';

export const Account = () => {
  const navigate = useNavigate();
  const [popup, setPopup] = useState<boolean>(false);
  const [viewDelete, setViewDelete] = useState<boolean>(false);

  const navigateBack = () => {
    navigate(-1);
  };
  const handlePopup = () => {
    setPopup(true);
  };
  const handleDelete = () => {
    setViewDelete(true);
  };
  return (
    <BackGround>
      {popup && <Overlay />}
      {viewDelete === false && (
        <>
          <Prev src={prev} onClick={navigateBack} />
          <List>
            <Container onClick={handlePopup}>
              <Area>
                <img src={logout} style={{ width: '24px', height: '24px' }} />
                <span>로그아웃</span>
              </Area>
            </Container>
            <Container onClick={handleDelete}>
              <Area>
                <img src={out} style={{ width: '24px', height: '24px' }} />
                <span>탈퇴하기</span>
              </Area>
            </Container>
          </List>
        </>
      )}
      {popup && <Logout setPopup={setPopup} />}
      {viewDelete && (
        <Suspense>
          <AccountDelete setViewDelete={setViewDelete} />
        </Suspense>
      )}
    </BackGround>
  );
};
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.6);

  transition: background 0.3s ease;
`;
const BackGround = styled.div`
  position: relative;
  left: 50%;

  display: flex;

  flex-direction: column;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: #fff;

  transform: translateX(-50%);
`;
const Prev = styled.img`
  width: 8px;
  height: 16px;

  margin-top: 16px;
  margin-left: 20px;

  cursor: pointer;
`;
const List = styled.div`
  display: flex;
  display: flex;

  flex-direction: column;

  align-items: center;
  align-self: stretch;

  margin-top: 12px;
  margin-right: 16px;
  margin-left: 21px;
`;
const Container = styled.div`
  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;
  justify-content: flex-start;

  padding-bottom: 16px;
  margin-top: 16px;

  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

  line-height: 20px;

  color: #060d24;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
const Area = styled.div`
  display: flex;

  gap: 8px;
  align-items: center;

  cursor: pointer;
`;
