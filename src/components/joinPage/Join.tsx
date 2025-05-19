import React, { useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { userQuery } from '../../api/queries';
import { Policies } from '../../constants';
import { DeleteConfirm } from '../InvitePage/Delete/DeleteConfirm';
import Deleted from './Deleted';
import { JoinModal } from './JoinModal';
import NoAccess from './NoAccess';
import Started from './Started';

export const Join = () => {
  const { letterId } = useParams();
  const letterNumId = Number(letterId);

  const { data: myInfo } = useSuspenseQuery(userQuery.myInfo());
  const { data: visit } = useSuspenseQuery(userQuery.visitUser());

  const [nickname, setNickname] = useState<string>('');
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [duplicateError, setDuplicateError] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [deleteConf, setDeleteConf] = useState<boolean>(false);
  const [noAccess, setNoAccess] = useState<boolean>(false);

  const handleModal = async () => {
    if (nickname) {
      setViewModal(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    let unicodeChars = Array.from(value);
    if (unicodeChars.length > Policies.NICKNAME_MAX_LENGTH) {
      value = unicodeChars.slice(0, Policies.NICKNAME_MAX_LENGTH).join('');
      unicodeChars = Array.from(value);
    }

    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      setNickname('');
      return;
    }

    setNickname(trimmedValue);
    setDuplicateError(false);
  };

  return (
    <>
      {noAccess && <NoAccess />}
      {started && <Started />}
      {deleted && <Deleted />}
      {deleteConf && <DeleteConfirm />}

      {!noAccess && !started && !deleted && !deleteConf && (
        <BackGround>
          {viewModal && <Overlay />}
          {
            <>
              <Title>
                <Text>{myInfo.name}님, 환영해요!</Text>
                <Text>편지에 사용할 닉네임을 정해주세요</Text>
              </Title>
              <Container>
                <InputBox $hasError={duplicateError}>
                  <InputLogo>내 이름</InputLogo>
                  <Input
                    required
                    placeholder="5자까지 입력할 수 있어요"
                    type="text"
                    value={nickname}
                    onChange={handleInputChange}
                    spellCheck={false}
                    minLength={1}
                  />
                </InputBox>
                {duplicateError && nickname && (
                  <ErrorMessage>이미 사용중인 닉네임입니다.</ErrorMessage>
                )}
              </Container>
              {nickname === '' ? (
                <Button disabled={true} style={{ background: '#ced4da' }}>
                  <ButtonTxt>완료</ButtonTxt>
                </Button>
              ) : (
                <Button
                  style={{
                    background: '#FFA256',
                    boxShadow:
                      '1px -1px 0.4px 0px rgba(0, 0, 0, 0.14), 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30)',
                  }}
                  onClick={handleModal}
                >
                  <ButtonTxt>완료</ButtonTxt>
                </Button>
              )}
            </>
          }
          {viewModal && (
            <JoinModal
              letterId={letterNumId}
              visited={visit.isVisited}
              nickname={nickname}
              setViewModal={setViewModal}
              setNoAccess={setNoAccess}
              setDeleted={setDeleted}
              setStarted={setStarted}
              setDeleteConf={setDeleteConf}
            />
          )}
        </BackGround>
      )}
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.6);

  transition: background 0.3s ease;
`;
const ErrorMessage = styled.div`
  left: 0;

  height: 16px;

  margin-top: 2px;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #ff0004;

  text-align: center;
  letter-spacing: -0.5px;
`;

const BackGround = styled.div`
  position: relative;
  left: 50%;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  overflow: hidden;

  background: linear-gradient(
    180deg,
    #d3edff 0%,
    #e7f6f7 46.2%,
    #feffee 97.27%
  );

  background-blend-mode: overlay, normal;

  transform: translateX(-50%);
`;
const Title = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  margin-top: 3rem;
  margin-bottom: 1.5rem;
`;
const Text = styled.span`
  display: block;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #243348;

  text-align: center;
  letter-spacing: -0.5px;
`;
const Container = styled.div`
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: flex-start;
  justify-content: center;

  width: 288px;

  padding: 20px;

  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 0px 6px 0px rgba(36, 51, 72, 0.08);
`;
const InputBox = styled.div<{ $hasError: boolean }>`
  display: flex;

  flex-direction: column;

  gap: 6px;
  justify-content: center;

  width: 16rem;
  height: 3.5rem;

  margin-top: 0;
  margin-bottom: 1.8px;

  cursor: pointer;

  border-bottom: 1px dashed
    ${(props) => (props.$hasError ? '#ff0004' : '#dee2e6')};
`;
const InputLogo = styled.div`
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #495057;

  letter-spacing: -0.5px;
`;
const Input = styled.input`
  width: 232px;
  height: 24px;

  padding-left: 0;

  background: #fff;
  border: 0;
  &::placeholder {
    font-family: var(--Typography-family-title, SUIT);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;

    line-height: 24px;

    color: #adb5bd;

    letter-spacing: -0.5px;
  }
  &:valid {
    font-family: var(--Typography-family-title, SUIT);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;

    line-height: 24px;

    color: #212529;

    letter-spacing: -0.5px;
  }
  &:focus {
    outline: none;
  }
`;
const Button = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;

  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  width: 288px;
  height: 48px;

  padding: 14px 20px;

  cursor: pointer;

  border-radius: 50px;

  transform: translateX(-50%);
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #fff;

  letter-spacing: -0.5px;
`;
