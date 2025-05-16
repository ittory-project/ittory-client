import React, { useEffect, useRef, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import calender from '../../../../public/assets/calendar.svg';
import X from '../../../../public/assets/x.svg';
import { userQuery } from '../../../api/queries';
import BottomSheet from './BotttomSheet';

interface Props {
  myName: string;
  setMyName: React.Dispatch<React.SetStateAction<string>>;
  receiverName: string;
  setReceiverName: React.Dispatch<React.SetStateAction<string>>;
  deliverDay: Date | null | string;
  setDeliverDay: React.Dispatch<React.SetStateAction<Date | null | string>>;
  setViewCoverDeco: React.Dispatch<React.SetStateAction<boolean>>;
  setViewStartpage: React.Dispatch<React.SetStateAction<boolean>>;
}

//사파리에서 커서 튀어오름

export default function LetterInfo({
  myName,
  setMyName,
  receiverName,
  setReceiverName,
  deliverDay,
  setDeliverDay,
  setViewCoverDeco,
  setViewStartpage,
}: Props) {
  const { data: myInfo } = useSuspenseQuery(userQuery.myInfo());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const receiverInputRef = useRef<HTMLInputElement | null>(null);
  const myNameInputRef = useRef<HTMLInputElement | null>(null);
  const [focusedField, setFocusedField] = useState<
    'receiver' | 'myName' | null
  >(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const keyboardHeight =
          window.innerHeight - window.visualViewport.height; // 키보드 높이 계산
        if (keyboardHeight > 0) {
          if (window.innerWidth < 850) {
            setKeyboardVisible(true);
          } else {
            setKeyboardVisible(false);
          }
        } else {
          setKeyboardVisible(false);
        }
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);

    handleResize();

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  const handleFocus = (field: 'receiver' | 'myName') => {
    setFocusedField(field); // 포커스된 필드를 추적
  };

  useEffect(() => {
    if (keyboardVisible) {
      if (focusedField === 'receiver') {
        receiverInputRef.current?.focus();
      } else if (focusedField === 'myName') {
        myNameInputRef.current?.focus();
      }
    }
  }, [focusedField]);

  return (
    <BackGround>
      {isModalOpen && <Overlay />}
      <Cancel onClick={handleCancel}>
        <img src={X} alt="X Icon" style={{ width: '14px', height: '14px' }} />
      </Cancel>
      <Container>
        <Title $keyboardVisible={keyboardVisible}>
          <Text>{myInfo.name}님,</Text>
          <Text>같이 편지를 만들어봐요!</Text>
        </Title>
        <MainCotainer $shiftup={keyboardVisible} $isopen={String(isModalOpen)}>
          <InputBox>
            <InputLogo>받는 사람</InputLogo>
            <Input
              ref={receiverInputRef}
              onFocus={() => handleFocus('receiver')}
              required
              placeholder="12자까지 입력할 수 있어요"
              type="text"
              value={receiverName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 12) {
                  e.target.value = e.target.value.slice(0, 12);
                }
                setReceiverName(e.target.value);
              }}
              $minLength={1}
              $maxLength={12}
              spellCheck="false"
            />
          </InputBox>
          <InputBox>
            <InputLogo>내 이름</InputLogo>
            <Input
              ref={myNameInputRef}
              onFocus={() => handleFocus('myName')}
              required
              placeholder="5자까지 입력할 수 있어요"
              type="text"
              value={myName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.value.length > 5) {
                  e.target.value = e.target.value.slice(0, 5);
                }
                setMyName(e.target.value);
              }}
              $minLength={1}
              $maxLength={5}
              spellCheck="false"
            />
          </InputBox>
          <InputBox>
            <InputLogo>전달 날짜</InputLogo>
            <InputBoxRow
              onClick={() => {
                openModal();
              }}
            >
              {deliverDay === null ? (
                <SelectDate style={{ color: '#adb5bd' }}>
                  날짜를 선택해 주세요
                </SelectDate>
              ) : (
                <SelectDate style={{ color: '#212529' }}>
                  {`${format(deliverDay, 'yyyy')}.`}
                  {`${format(deliverDay, 'M')}.`}
                  {format(deliverDay, 'd')}
                  {` (${format(deliverDay, 'E', { locale: ko })})`}
                </SelectDate>
              )}
              <Calender>
                <img
                  src={calender}
                  alt="calender Icon"
                  style={{ width: '18px', height: '19px' }}
                />
              </Calender>
            </InputBoxRow>
          </InputBox>
        </MainCotainer>
      </Container>
      {myName === '' || receiverName === '' || deliverDay === null ? (
        <Button
          disabled={true}
          style={{ background: '#ced4da' }}
          $keyboardVisible={keyboardVisible}
        >
          <ButtonTxt>다음</ButtonTxt>
        </Button>
      ) : (
        <Button
          $keyboardVisible={keyboardVisible}
          style={{
            background: '#FFA256',
            boxShadow:
              '1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset',
            border: 'none',
          }}
          onClick={() => {
            localStorage.setItem('receiver', receiverName);
            localStorage.setItem('myName', myName);
            localStorage.setItem('Date', String(deliverDay));
            setViewCoverDeco(true);
            setViewStartpage(false);
          }}
        >
          <ButtonTxt>다음</ButtonTxt>
        </Button>
      )}
      {isModalOpen && (
        <BottomSheet
          deliverDay={deliverDay}
          setDeliverDay={setDeliverDay}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </BackGround>
  );
}
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
const BackGround = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: linear-gradient(
    180deg,
    #d3edff 0%,
    #e7f6f7 46.2%,
    #feffee 97.27%
  );

  background-blend-mode: overlay, normal;
`;
const Cancel = styled.span`
  position: absolute;
  top: 10px;
  right: 16px;

  cursor: pointer;
`;
const Container = styled.div`
  position: relative;

  display: flex;

  flex: 1 0 0;
  flex-direction: column;

  gap: 24px;

  width: calc(100% - 48px);

  margin-top: 48px;
  margin-right: 24px;
  margin-left: 24px;
`;
const Title = styled.div<{ $keyboardVisible: boolean }>`
  position: relative;

  display: ${(props) => (props.$keyboardVisible ? 'none' : 'flex')};

  flex-direction: column;

  align-items: center;
  justify-content: center;

  margin-top: 0;
  margin-bottom: 0;
`;
const Text = styled.span`
  display: inline-block;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #243348;

  text-align: center;
  letter-spacing: -0.5px;
`;
const MainCotainer = styled.div<{ $shiftup?: boolean; $isopen?: string }>`
  position: relative;
  top: 0;

  display: flex;

  flex-direction: column;

  gap: 22px;
  align-items: center;

  padding: 20px;
  margin-top: 0;

  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 0px 6px 0px rgba(36, 51, 72, 0.08);

  transform: ${(props) =>
    props.$shiftup ? 'translateY(0.8rem)' : 'translateY(0)'};

  transition: transform 0.3s ease;
`;

const InputBox = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  justify-content: center;

  width: 100%;
  height: 60px;

  margin-top: 0;

  border-bottom: 1px dashed #dee2e6;
`;
const InputLogo = styled.div`
  position: absolute; /* 위치 고정 */
  top: 0; /* 고정 위치 */
  left: 0;

  width: 100%;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #495057;

  letter-spacing: -0.5px;
`;
const Input = styled.input<{ $minLength?: number; $maxLength?: number }>`
  width: 232px;
  height: 26px;

  padding-left: 0;
  margin-top: 28px;
  margin-bottom: 6px;

  cursor: pointer;

  background-color: #ffffff;
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
const InputBoxRow = styled.div`
  display: flex;

  flex-direction: row;

  align-items: center;

  margin-bottom: 6px;

  cursor: pointer;
`;
const SelectDate = styled.span`
  width: 100%;

  margin-top: 28px;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;

  line-height: 24px;

  letter-spacing: -0.5px;

  border: 0;
`;
const Calender = styled.span`
  position: absolute;
  right: 0;

  margin-top: 28px;

  cursor: pointer;
`;
const Button = styled.button<{ $keyboardVisible: boolean }>`
  position: relative;
  bottom: 20px;

  display: flex;

  /* 키보드가 보일 때 버튼 숨기기 */
  display: ${(props) => (props.$keyboardVisible ? 'none' : 'flex')};

  gap: 8px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  height: 48px;

  padding: 14px 20px;
  margin-right: 16px;
  margin-left: 16px;

  cursor: pointer;

  border-radius: 50px;
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
