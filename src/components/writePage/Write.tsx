import { useEffect, useRef, useState } from 'react';

import { useQueryClient, useSuspenseQueries } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';

import { Policies } from '@/constants';

import { ElementResponse } from '../../api/model/ElementModel';
import { letterQuery, userQuery } from '../../api/queries';
import { getWebSocketApi } from '../../api/websockets';
import { useDialog } from '../../hooks';
import { SessionLogger } from '../../utils';
import { Button } from '../common/Button';
import { ErrorFullScreen } from '../common/ErrorFullScreen';
import { WriteFinishedModal } from './WriteFinishedModal';
import { WriteLocation } from './WriteLocation';
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

  if (!letterId) {
    throw new Error('존재하지 않는 편지입니다.');
  }

  const [
    { data: myInfo },
    { data: startInfo },
    { data: letterDetailInfo },
    { data: elements },
    { data: participants },
  ] = useSuspenseQueries({
    queries: [
      userQuery.myInfo(),
      letterQuery.startInfoById(letterId),
      letterQuery.detailById(letterId),
      letterQuery.elementsById(letterId),
      letterQuery.participantsByIdInSequenceOrder(letterId),
    ],
  });

  const isWholeWritingFinished =
    letterDetailInfo.finishedAt &&
    new Date().getTime() - new Date(letterDetailInfo.finishedAt).getTime() >=
      Policies.LETTER_WRITE_DONE_DIALOG_SHOW_TIME;
  const waitingElement = elements.find((element) => element.content === null);
  const isRoomMaster =
    participants.participants[0]?.memberId === myInfo.memberId;
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

  const nowElementRef = useRef<HTMLDivElement | null>(null);
  const elementListRef = useRef<HTMLDivElement | null>(null);

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

  // NOTE: 백그라운드 -> 포어그라운드 전환 시 즉시 웹소켓이 재연결되지 않으므로,
  // windowFocus 시점과 소켓 연결 시점 사이의 이벤트를 받을 수 없으므로 필요
  const refreshOnWsReconnect = () => {
    queryClient.invalidateQueries({
      queryKey: letterQuery.queryKeys.byId(letterId),
    });
  };

  useEffect(() => {
    wsApi.addOnConnectJob(refreshOnWsReconnect);

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
        closeWritingDialog();
        queryClient.invalidateQueries({
          queryKey: letterQuery.queryKeys.elementsById(letterId),
        });
      },
      exit(response) {
        const exitMember = participants.participants.find(
          (participant) => participant.memberId === response.exitMemberId,
        );
        // NOTE: 본인이 나가서 participant 목록에 없음
        // 이 경우 `userNotParticipated` 값으로 자동으로 '2번 이상 무응답' 케이스로 분기
        if (!exitMember) {
          return;
        }
        openExitAlert(exitMember.nickname);
        queryClient.invalidateQueries({
          queryKey: letterQuery.queryKeys.byId(letterId),
        });
      },
      async finish() {
        openFinishedModal(isRoomMaster);

        // finished modal onClose 시에 이렇게 처리하는 게 나을 듯
        setTimeout(() => {
          navigate(`/share/${letterId}?page=1`);
        }, Policies.LETTER_WRITE_DONE_DIALOG_SHOW_TIME);
      },
    });

    return () => {
      unsubscribe();
      wsApi.removeOnConnectJob(refreshOnWsReconnect);
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

  const scrollToFocusNowElement = () => {
    if (!nowElementRef.current || !elementListRef.current) {
      return;
    }

    // NOTE: getBoundingClientRect() 함수는 뷰포트 상 좌표를 반환, 뷰포트 위로 이탈한 경우 음수가 됨
    const nowElementY = nowElementRef.current.getBoundingClientRect().top;
    const elementListY = elementListRef.current.getBoundingClientRect().top;
    const listScrollTop = elementListRef.current.scrollTop; // NOTE: 스크롤을 내릴수록 양수로 커지는 값

    const STICKY_HEADER_HEIGHT = 70;
    const elementYInList = nowElementY - elementListY;
    const yAboveCurrentElement =
      listScrollTop + elementYInList - STICKY_HEADER_HEIGHT;

    elementListRef.current.scrollTo({
      top: yAboveCurrentElement,
      behavior: 'smooth',
    });
  };

  const writingMember = participants.participants.find(
    (participant) => participant.memberId === waitingElement?.memberId,
  );

  if (isWholeWritingFinished) {
    navigate(`/share/${letterId}?page=1`);
    return null;
  }

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
        {isExitAlertOpen && exitUser && <WriteQuitAlert name={exitUser} />}
      </AlertContainer>
      <Container>
        <ScrollableOrderList
          ref={elementListRef}
          style={{ overflowY: isWriting ? 'hidden' : 'auto' }}
        >
          <StickyHeader>
            <WriteOrderTitle
              writeOrderList={participants.participants}
              title={startInfo.title}
            />
          </StickyHeader>
          <WriteOrderList
            elements={elements}
            isMyTurnToWrite={isMyTurnToWrite}
            nowElementRef={nowElementRef}
          />
        </ScrollableOrderList>
        {isMyTurnToWrite
          ? waitingElement?.nickname && (
              <ButtonContainer>
                <Button
                  text="편지를 적어주세요"
                  color="#FCFFAF"
                  onClick={openWritingDialog}
                />
              </ButtonContainer>
            )
          : waitingElement?.nickname && (
              <LocationContainer onClick={scrollToFocusNowElement}>
                <WriteLocation
                  startedAt={waitingElement.startedAt}
                  name={waitingElement.nickname}
                  profileImage={writingMember?.imageUrl}
                />
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
  height: calc(var(--vh, 1vh) * 100);

  overflow-y: hidden;
`;
