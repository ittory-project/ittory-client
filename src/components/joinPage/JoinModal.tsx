import React from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import { ApiErrorCodes } from '@/api/config/errorCodes';
import { SessionLogger } from '@/utils';

import { postEnter } from '../../api/service/LetterService';

const logger = new SessionLogger('join');

interface Props {
  letterId: number;
  nickname: string;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  visited: boolean;
  setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setNoAccess: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteConf: React.Dispatch<React.SetStateAction<boolean>>;
}

export const JoinModal = ({
  letterId,
  nickname,
  setViewModal,
  visited,
  setStarted,
  setNoAccess,
  setDeleted,
  setDeleteConf,
}: Props) => {
  const navigate = useNavigate();

  const handleCancel = async () => {
    setViewModal(false);
  };

  const handleAccess = async () => {
    try {
      const enterresponse = await postEnter(letterId, { nickname });
      if (enterresponse.enterStatus === true) {
        fianlAccess();
      } else {
        if (enterresponse.enterAction === 'EXCEEDED') {
          setNoAccess(true);
        } else if (enterresponse.enterAction === 'STARTED') {
          setStarted(true);
        } else if (enterresponse.enterAction === 'DELETED') {
          setDeleteConf(true);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        switch (error.response?.data.code) {
          case ApiErrorCodes.ALREADY_ENTERED:
            // FIXME: 별도의 modal 등으로 개선 필요
            alert('이미 참여중인 사용자입니다.');
            break;
          case ApiErrorCodes.ALREADY_USED_NICKNAME:
            // FIXME: Form Validation으로 개선 필요
            alert('이미 사용중인 닉네임입니다.');
            break;
          default:
            logger.error('알 수 없는 에러 발생', error);
        }
      } else if (axios.isAxiosError(error) && error.response?.status === 404) {
        setDeleted(true);
      }
    }
  };

  const fianlAccess = () => {
    navigate(`/invite/${letterId}?guideOpen=${!visited}`);
  };

  return (
    <>
      <Modal>
        <Title>'{nickname}'님</Title>
        <Title>으로 참여할까요?</Title>
        <Contents>닉네임은 한번 설정하면 수정할 수 없어요</Contents>
        <ButtonContainer>
          <Button
            style={{
              background: '#CED4DA',
            }}
            onClick={handleCancel}
          >
            <ButtonTxt style={{ color: '#495057' }}>취소하기</ButtonTxt>
          </Button>
          <Button
            style={{
              background: '#FFA256',
            }}
            onClick={handleAccess}
          >
            <ButtonTxt style={{ color: '#fff' }}>네!</ButtonTxt>
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
  align-items: center;

  width: 272px;
  height: 11.6rem;

  padding: 24px;
  margin: 0;

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

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #212529;

  text-align: center;
  letter-spacing: -0.5px;
`;
const Contents = styled.div`
  display: flex;

  flex-direction: column;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  align-self: stretch;

  margin-top: 7px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px;

  color: #868e96;

  text-align: center;
  letter-spacing: -0.5px;
`;
const ButtonContainer = styled.div`
  position: relative;

  display: flex;
  display: flex;

  gap: 8px;
  align-items: flex-start;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  width: 100%;

  margin-top: 1.35rem;
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

  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 14px;

  letter-spacing: -0.5px;
`;
