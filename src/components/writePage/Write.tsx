import { useEffect, useState } from 'react';

import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { ElementResponse } from '../../api/model/ElementModel';
import { letterQuery, userQuery } from '../../api/queries';
import { getWebSocketApi } from '../../api/websockets';
import { useDialog } from '../../hooks';
import { use100vh } from '../../hooks/use100vh';
import { SessionLogger } from '../../utils';
import Button from '../common/Button';
import { ErrorFullScreen } from '../common/ErrorFullScreen';
import { WriteFinishedModal } from './WriteFinishedModal';
import { WriteLocation } from './WriteLocation';
import { WriteOrderAlert } from './WriteOrderAlert';
import { WriteOrderTitle } from './WriteOrderTitle';
import { WriteQuitAlert } from './WriteQuitAlert';
import { WriteElement } from './writeElement/WriteElement';
import { WriteOrderList } from './writeMainList/WriteOrderList';

const logger = new SessionLogger('write');

export const Write = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const wsApi = getWebSocketApi();
  const { letterId: _letterId } = useParams();
  const letterId = Number(_letterId);
  const [
    { data: myInfo },
    { data: startInfo },
    { data: elements },
    { data: participants },
  ] = useSuspenseQueries({
    queries: [
      userQuery.myInfo(),
      letterQuery.startInfoById(letterId),
      letterQuery.elementsById(letterId),
      letterQuery.participantsById(letterId),
    ],
  });
  const vh = use100vh();

  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [vh]);

  // ErrorBoundary 구성하기
  if (participants.participants.length === 0) {
    throw 'Error: 참여자가 없습니다.';
  }

  const waitingElement = elements.find((element) => element.content === null);
  const isRoomMaster =
    participants.participants[0].memberId === myInfo.memberId;
  const isMyTurnToWrite = waitingElement?.memberId === myInfo.memberId;
  const userNotParticipated = !participants.participants.some(
    (participant) => participant.memberId === myInfo.memberId,
  );

  const {
    isOpen: isExitAlertOpen,
    openDialog: openExitAlert,
    dialogParams: exitUser,
  } = useDialog<string>({
    closeTimeout: 5_000,
  });

  const { isOpen: isFinishedModalOpen, openDialog: openFinishedModal } =
    useDialog({ closeTimeout: 5_000 });

  const [isWriting, setIsWriting] = useState(false);

  const openWritingDialog = () => {
    setIsWriting(true);
  };

  const handleWriteSubmit = (content: string) => {
    if (!waitingElement) {
      return;
    }

    logger.debug('작성 정보 전송: ', content);
    wsApi.send('writeLetterElement', [letterId], {
      elementId: waitingElement.elementId,
      content,
    });
    closeWritingDialog();
  };

  const closeWritingDialog = () => {
    setIsWriting(false);
  };

  // 잘못 접근하면 화면 띄우지 않게 하려고 - 임시방편
  if (!letterId) {
    throw 'Error: 잘못된 접근입니다.';
  }

  useEffect(() => {
    const unsubscribe = wsApi.subscribe('letter', [letterId], {
      write(response) {
        logger.debug('ws 응답으로 cache 갱신');
        queryClient.setQueryData(
          letterQuery.queryKeys.elementsById(letterId),
          (currentData: ElementResponse[]) => {
            return currentData.map((element) => {
              if (element.elementId === response.completedElement.elementId) {
                return response.completedElement;
              }
              if (element.elementId === response.upcomingElement.elementId) {
                return response.upcomingElement;
              }
              return element;
            });
          },
        );
      },
      timeout() {
        logger.debug('타임 아웃!');
        queryClient.invalidateQueries({
          queryKey: letterQuery.queryKeys.elementsById(letterId),
        });
      },
      exit(response) {
        logger.debug('퇴장!', response);
        const exitMember = participants.participants.find(
          (participant) => participant.memberId === response.exitMemberId,
        );
        if (!exitMember) {
          throw 'Error: 참여자가 없습니다.';
        }
        openExitAlert(exitMember.nickname);
        queryClient.invalidateQueries({
          queryKey: letterQuery.queryKeys.byId(letterId),
        });
      },
      async finish() {
        logger.debug('완료');
        openFinishedModal(isRoomMaster);

        // finished modal onClose 시에 이렇게 처리하는 게 나을 듯
        setTimeout(() => {
          navigate(`/share/${letterId}?page=1`);
          queryClient.invalidateQueries({
            queryKey: letterQuery.queryKeys.byId(letterId),
          });
        }, 5000);
      },
    });

    return () => {
      logger.debug('unsubscribe call from useEffect');
      unsubscribe();
    };
  }, []);

  //키보드 올라올때 body
  useEffect(() => {
    if (isWriting) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // 컴포넌트 언마운트 시 원상복구
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWriting]);

  return (
    <>
      {userNotParticipated && (
        // NOTE: 현재 퇴장 정책은 2번 이상 무응답 외 없음
        <ErrorFullScreen
          errorMessage={`2번 이상 편지를 적지 않아서\n자동으로 퇴장되었어요`}
        />
      )}
      {isFinishedModalOpen && <WriteFinishedModal />}
      <AlertContainer>
        {!isMyTurnToWrite && waitingElement?.nickname && (
          <WriteOrderAlert name={waitingElement.nickname} isNextAlert={false} />
        )}
        {isExitAlertOpen && exitUser && <WriteQuitAlert name={exitUser} />}
      </AlertContainer>
      <Container>
        <StickyHeader>
          <WriteOrderTitle
            writeOrderList={participants.participants}
            title={startInfo.title}
          />
        </StickyHeader>
        <ScrollableOrderList
          style={{ overflowY: isWriting ? 'hidden' : 'auto' }}
        >
          <WriteOrderList
            elements={elements}
            isMyTurnToWrite={isMyTurnToWrite}
          />
        </ScrollableOrderList>
        {isMyTurnToWrite ? (
          <ButtonContainer>
            <Button
              text="작성하기"
              color="#FCFFAF"
              onClick={openWritingDialog}
            />
          </ButtonContainer>
        ) : (
          <LocationContainer>
            {waitingElement?.nickname && (
              <WriteLocation
                startedAt={waitingElement.startedAt}
                name={waitingElement.nickname}
                profileImage={waitingElement.imageUrl}
              />
            )}
          </LocationContainer>
        )}
      </Container>

      {isWriting && (
        <ModalOverlay>
          {waitingElement && (
            <WriteElement
              element={waitingElement}
              onSubmit={handleWriteSubmit}
              onClose={closeWritingDialog}
            />
          )}
        </ModalOverlay>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;

  flex-direction: column;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  padding: 10px 20px;

  /* 키보드에 영향 안 받게 고정 */
  overflow: hidden;

  background-color: #212529;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 10px;
  z-index: 3;
`;

const AlertContainer = styled.div`
  position: absolute;
  top: 60px;
  z-index: 3;

  display: flex;

  flex-direction: column;

  width: 100%;

  padding: 0px;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const ScrollableOrderList = styled.div`
  flex-grow: 1;

  margin: 10px 5px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  position: sticky;
  bottom: 10px;
  z-index: 3;

  background-color: transparent;
`;

const LocationContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 3;

  background-color: transparent;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;
