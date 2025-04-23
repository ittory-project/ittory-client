import React from 'react';

import styled from 'styled-components';

import delete2 from '../../../public/assets/delete2.svg';
import X from '../../../public/assets/x.svg';

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Received_Modal = ({ setIsModalOpen, setPopup }: Props) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePopup = () => {
    setIsModalOpen(false);
    setPopup(true);
  };

  return (
    <ModalContainer>
      <Header>
        <Cancel src={X} alt="cancel" onClick={closeModal} />
      </Header>
      <Contents>
        <List onClick={handlePopup}>
          <DeleteIcon src={delete2} alt="delete" />
          <Txt>삭제하기</Txt>
        </List>
      </Contents>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;

  background: #fff;
  border-radius: 20px 20px 0px 0px;
`;
const Header = styled.div`
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: flex-end;
  align-self: stretch;

  height: 44px;

  padding: 24px 20px 0 0;
`;
const Cancel = styled.img`
  flex-shrink: 0;

  width: 14px;
  height: 14px;

  margin-right: 7.3px;
`;
const Contents = styled.div`
  display: flex;

  flex-direction: column;

  align-items: flex-end;
  align-self: stretch;

  padding: 0px 20px 24px 16px;
`;
const List = styled.div`
  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;

  padding: 12px 0px;
`;
const DeleteIcon = styled.img`
  flex-shrink: 0;

  width: 24px;
  height: 24px;
`;
const Txt = styled.div`
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;

  line-height: 24px;

  color: #212529;

  letter-spacing: -0.5px;
`;
