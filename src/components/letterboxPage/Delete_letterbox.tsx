import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { deleteLetterboxLetter } from '../../api/service/MemberService';

interface Props {
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLetter: React.Dispatch<React.SetStateAction<boolean>>;
  context: string;
  deleteItem: string;
  letterId: number;
  setDeleteAlert: React.Dispatch<React.SetStateAction<string | null>>;
  deleteAlert: string | null;
}

export const Delete_letterbox = ({
  setPopup,
  setIsModalOpen,
  context,
  deleteItem,
  setOpenLetter,
  letterId,
  setDeleteAlert,
}: Props) => {
  const [deleteName, setDeleteName] = useState<string>('');

  useEffect(() => {
    setDeleteName(deleteItem);
  }, [deleteItem]);

  const cancelDelete = () => {
    setPopup(false);
  };
  const handleDelete = async () => {
    await deleteLetterboxLetter(letterId);
    localStorage.setItem('deletedLetter', '편지가 삭제되었어요');
    setPopup(false);
    setIsModalOpen(false);
    setOpenLetter(false);
    setDeleteAlert('편지가 삭제되었어요');
  };

  return (
    <>
      <Modal>
        {context === 'created' && <Title>'To.{deleteName}'</Title>}
        {context === 'received' && <Title>'{deleteName}'</Title>}
        <Title>편지를 정말 삭제시겠어요?</Title>
        <Contents>삭제한 편지는 복구할 수 없어요</Contents>
        <ButtonContainer>
          <Button
            style={{
              background: '#CED4DA',
            }}
            onClick={cancelDelete}
          >
            <ButtonTxt style={{ color: '#495057' }}>취소하기</ButtonTxt>
          </Button>
          <Button
            style={{
              background: '#FFA256',
            }}
            onClick={handleDelete}
          >
            <ButtonTxt style={{ color: '#fff' }}>삭제하기</ButtonTxt>
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

  margin-top: 8px;

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

  gap: 8px;
  align-items: flex-start;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  width: 100%;

  margin-top: 20px;
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
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 20px;

  letter-spacing: -0.5px;
`;
