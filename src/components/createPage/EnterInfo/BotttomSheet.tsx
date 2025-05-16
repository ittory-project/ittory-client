import React, { useEffect, useRef } from 'react';

import styled from 'styled-components';

import CalenderView from './CalenderView';

interface Props {
  deliverDay: Date | null | string;
  setDeliverDay: React.Dispatch<React.SetStateAction<Date | null | string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BottomSheet({
  deliverDay,
  setDeliverDay,
  setIsModalOpen,
}: Props) {
  const modalBackground = useRef<HTMLDivElement | null>(null);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        modalBackground.current &&
        !modalBackground.current.contains(e.target as Node)
        //컴포넌트 특정 영역 외 클릭 감지
      ) {
        closeModal();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [modalBackground]);

  const handleButton = () => {
    if (deliverDay !== null) {
      closeModal();
    }
  };

  return (
    <ModalContainer ref={modalBackground}>
      <CalenderView setValue={setDeliverDay} deliverDay={deliverDay} />
      {deliverDay !== null ? (
        <Button onClick={handleButton}>
          <ButtonTxt>선택</ButtonTxt>
        </Button>
      ) : (
        <Button disabled={true}>
          <ButtonTxt>선택</ButtonTxt>
        </Button>
      )}
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;

  padding: 28px 0px 18px 0px;

  background: #fff;
  border-radius: 24px 24px 0px 0px;
`;
const Button = styled.button`
  position: relative;

  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  padding: 14px 20px;
  margin-right: 16px;
  margin-left: 16px;

  cursor: pointer;

  background: #343a40;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
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
