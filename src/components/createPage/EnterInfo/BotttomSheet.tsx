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
  display: flex;
  width: 100%;
  border-radius: 24px 24px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
  padding: 28px 0px 18px 0px;
  box-sizing: border-box;
`;
const Button = styled.button`
  position: relative;
  //width: 100%;
  margin-right: 16px;
  margin-left: 16px;
  cursor: pointer;
  display: flex;
  padding: 14px 20px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 50px;
  background: #343a40;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  color: #fff;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
