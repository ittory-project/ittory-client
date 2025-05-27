import React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { accessTokenRepository } from '@/api/config/AccessTokenRepository';
import { userQuery } from '@/api/queries';

import { postLogout } from '../../api/service/AuthService';

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Logout = ({ setPopup }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleDelete = () => {
    setPopup(false);
  };

  const handleLogout = async () => {
    await postLogout();
    accessTokenRepository.logout();
    queryClient.setQueryData(userQuery.queryKeys.myInfo(), null);
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <>
      <Modal>
        <Title>로그아웃 하시겠어요?</Title>
        <ButtonContainer>
          <Button
            style={{
              backgroundColor: '#CED4DA',
            }}
            onClick={handleDelete}
          >
            <ButtonTxt style={{ color: '#495057' }}>취소하기</ButtonTxt>
          </Button>
          <Button
            style={{
              backgroundColor: '#FFA256',
            }}
            onClick={handleLogout}
          >
            <ButtonTxt style={{ color: '#fff' }}>로그아웃</ButtonTxt>
          </Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 272px;

  padding: 24px;

  background: linear-gradient(144deg, #fff -0.87%, #fff 109.18%);
  border: 3px solid #d3edff;
  border-radius: 16px;

  transform: translate(-50%, -50%);
`;
const Title = styled.div`
  display: flex;

  flex-direction: column;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  align-self: stretch;

  margin-bottom: 20px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #212529;

  text-align: center;
  letter-spacing: -0.5px;
`;
const ButtonContainer = styled.div`
  position: relative;

  display: flex;

  gap: 8px;
  align-items: flex-start;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  width: 100%;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;

  flex: 1 0 0;

  gap: 8px;
  align-items: center;
  justify-content: center;

  height: 40px;

  padding: 14px 20px;

  border: none;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 20px;

  letter-spacing: -0.5px;
`;
