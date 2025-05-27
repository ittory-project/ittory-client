import React, { useEffect, useState } from 'react';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import more from '@/assets/more.svg';

import { userQuery } from '../../api/queries';
import { Created_Modal } from './Created_Modal';
import { Delete_letterbox } from './Delete_letterbox';
import { EmptyLetter } from './EmptyLetter';
import { Letter } from './Letter';

interface DeliverDayProps {
  deliverDate: string;
}

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLetter: React.Dispatch<React.SetStateAction<boolean>>;
  popup: boolean;
  openLetter: boolean;
  setDeleteAlert: React.Dispatch<React.SetStateAction<string | null>>;
  setDeletedAlert: React.Dispatch<React.SetStateAction<string | null>>;
  deleteAlert: string | null;
  deletedAlert: string | null;
}

export const CreatedLetter = ({
  setIsModalOpen,
  isModalOpen,
  setPopup,
  popup,
  setOpenLetter,
  openLetter,
  deleteAlert,
  setDeleteAlert,
  setDeletedAlert,
}: Props) => {
  const queryClient = useQueryClient();
  const { data: letterCounts } = useSuspenseQuery(userQuery.letterCounts());
  const { data: letters } = useSuspenseQuery(userQuery.participatedLetter());

  const [deleteName, setDeleteName] = useState<string>('');
  const [selectId, setSelectId] = useState<number>(-1);

  const openModal = (itemId: number) => {
    setSelectId(itemId);
    setIsModalOpen(true);
  };

  const handleLetter = (itemId: number) => {
    setSelectId(itemId);
    setOpenLetter(true);
  };

  useEffect(() => {
    const fetchLetter = async () => {
      if (deleteAlert !== null) {
        queryClient.invalidateQueries({
          queryKey: userQuery.queryKeys.letterCounts(),
        });
        queryClient.invalidateQueries({
          queryKey: userQuery.queryKeys.participatedLetter(),
        });

        const deletedMessage = localStorage.getItem('deletedLetter');
        setDeletedAlert(deletedMessage);
      }
    };

    fetchLetter();
  }, [deleteAlert]);

  return (
    <>
      {letters.length !== 0 ? (
        <>
          {!openLetter && letters && (
            <Container>
              <NumberHeader>
                <NumberTxt style={{ fontWeight: '400', marginRight: '2.5px' }}>
                  총
                </NumberTxt>
                <NumberTxt style={{ fontWeight: '700' }}>
                  {letterCounts.participationLetterCount}
                </NumberTxt>
                <NumberTxt style={{ fontWeight: '400' }}>개</NumberTxt>
              </NumberHeader>
              {letters.map((item) => (
                <LetterContainer
                  key={item.letterId}
                  $bgColor={item.coverTypeColor}
                >
                  <BookCover src={item.coverTypeImage} />
                  <Content
                    onClick={() => {
                      setDeleteName(item.receiverName);
                      handleLetter(item.letterId);
                    }}
                  >
                    <BookName>To. {item.receiverName}</BookName>
                    <DeliverDay deliverDate={item.deliveryDate}></DeliverDay>
                  </Content>
                  <MoreButton
                    src={more}
                    alt="more_btn"
                    onClick={() => {
                      setDeleteName(item.receiverName);
                      openModal(item.letterId);
                    }}
                  />
                </LetterContainer>
              ))}
              {isModalOpen && (
                <Created_Modal
                  setIsModalOpen={setIsModalOpen}
                  setPopup={setPopup}
                  openLetter={openLetter}
                  letterId={selectId}
                />
              )}
            </Container>
          )}
          {popup && !openLetter && (
            <Delete_letterbox
              setOpenLetter={setOpenLetter}
              setPopup={setPopup}
              setIsModalOpen={setIsModalOpen}
              context="created"
              deleteItem={deleteName}
              letterId={selectId}
              setDeleteAlert={setDeleteAlert}
              deleteAlert={deleteAlert}
            />
          )}
          {openLetter && (
            <Letter
              setOpenLetter={setOpenLetter}
              context="created"
              isModalOpen={isModalOpen}
              setPopup={setPopup}
              popup={popup}
              deleteItem={deleteName}
              letterId={selectId}
              setIsModalOpen={setIsModalOpen}
              openLetter={openLetter}
              setDeleteAlert={setDeleteAlert}
              deleteAlert={deleteAlert}
            />
          )}
        </>
      ) : (
        // letters 배열이 비어 있으면 EmptyLetter 컴포넌트 출력
        <EmptyLetter context="created" />
      )}
    </>
  );
};

const DeliverDay: React.FC<DeliverDayProps> = ({ deliverDate }) => {
  const date = new Date(deliverDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];

  return (
    <StyledDeliverDay>{`${year}. ${month}. ${day} (${weekday}) 전달`}</StyledDeliverDay>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;
  align-self: stretch;

  padding: 0px 16px;

  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const NumberHeader = styled.div`
  box-sizing: border-box;
  display: flex;

  align-items: flex-start;
  align-self: stretch;

  padding: 16px 0px;
`;
const NumberTxt = styled.span`
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;

  line-height: 16px;

  color: #212529;

  letter-spacing: -0.5px;
`;
const LetterContainer = styled.div<{ $bgColor: string }>`
  box-sizing: border-box;
  display: flex;

  gap: 12px;
  align-items: flex-start;

  width: 100%;

  padding: 20px 16px;
  margin-bottom: 16px;

  background-color: ${(props) => props.$bgColor};
  border-radius: 12px;
`;

const BookCover = styled.img`
  width: 36px;

  object-fit: cover;
`;
const Content = styled.div`
  display: flex;

  flex: 1;
  flex-direction: column;

  cursor: pointer;
`;
const BookName = styled.div`
  flex: 1 0 0;

  margin-bottom: 4px;

  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

  line-height: 20px;

  color: #212529;

  letter-spacing: -0.5px;
`;
const StyledDeliverDay = styled.div`
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #868e96;

  letter-spacing: -0.5px;
`;
const MoreButton = styled.img`
  flex-shrink: 0;

  width: 20px;
  height: 20px;

  cursor: pointer;
`;
