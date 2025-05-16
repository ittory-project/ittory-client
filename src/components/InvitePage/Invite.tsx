import { useEffect, useState } from 'react';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import texture from '../../../public/assets/invite/texture1.png';
import { LetterPartiListGetResponse } from '../../api/model/LetterModel';
import { WsEnterResponse, WsExitResponse } from '../../api/model/WsModel';
import { letterQuery, userQuery } from '../../api/queries';
import { getWebSocketApi } from '../../api/websockets';
import { useDialog } from '../../hooks';
import { inMillis } from '../../utils';
import { SessionLogger } from '../../utils/SessionLogger';
import { HostUser } from './HostUser';
import { Member } from './Member';

const logger = new SessionLogger('invite');

export const Invite = () => {
  const queryClient = useQueryClient();
  const wsApi = getWebSocketApi();
  const params = useParams<{
    letterId: string;
  }>();
  const letterId = Number(params.letterId);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const guideOpen = searchParams.get('guideOpen') === 'true';

  const { data: myPageData } = useSuspenseQuery(userQuery.myInfo());
  const { data: participants } = useSuspenseQuery({
    ...letterQuery.participantsById(letterId),
    // NOTE: useSuspenseQueries를 사용하면 타입이 any로 잡힘
    refetchInterval: (query) => {
      const me = query.state.data?.participants.find(
        (participant) => participant.memberId === myPageData.memberId,
      );
      return me ? false : inMillis().seconds(1).value();
    },
  });

  const [viewDelete, setViewDelete] = useState<boolean>(false); // 필요 여부 체크 필요함

  const {
    isOpen: isExitAlertOpen,
    openDialog: openExitAlert,
    dialogParams: exitUser,
  } = useDialog<string>({
    closeTimeout: 5_000,
  });

  const {
    isOpen: isHostAlertOpen,
    openDialog: openHostAlert,
    dialogParams: hostAlert,
  } = useDialog<string>({
    closeTimeout: 5_000,
  });

  const isRoomMaster =
    participants.participants[0]?.memberId === myPageData.memberId;

  useEffect(function handleWebSocketJobs() {
    // enterLetter는 반드시 보내야 하는 요청.
    // 현재 subscribe 완료 이전에 보내서 응답도 그 이전에 오는 상황
    // onSubscribe 콜백을 만들려고 했는데, 얘도 서버 응답이 없어서 타이밍 보장이 불가능함.
    // ws 수준에서 타이밍을 보장하려면 receipt, ack 등을 활용 필요 (굳이 그정도까지 빨라야 할 필요는 없음)
    // enterLetter는 한 번만 호출하고, participants만 지속해서 폴링하는 방식으로 처리
    wsApi.send('enterLetter', [letterId], { nickname: myPageData.name });

    const unsubscribe = wsApi.subscribe('letter', [letterId], {
      enter: (response: WsEnterResponse) => {
        logger.debug('enterLetter response', response);
        queryClient.setQueryData(
          letterQuery.queryKeys.participantsById(letterId),
          (oldData: LetterPartiListGetResponse) => {
            return {
              ...oldData,
              participants: response.participants,
            };
          },
        );
      },
      exit: async (response: WsExitResponse) => {
        logger.debug('exitLetter response', response);
        queryClient.invalidateQueries({
          queryKey: letterQuery.queryKeys.participantsById(letterId),
        });

        const exitUserNickname = participants.participants.find(
          (participant) => participant.memberId === response.exitMemberId,
        )?.nickname;

        if (response.isManager) {
          logger.debug('방장 퇴장 감지');
          openExitAlert(`방장 '${exitUserNickname}'님이 퇴장했어요`);
          await queryClient.invalidateQueries({
            queryKey: letterQuery.queryKeys.participantsById(letterId),
          });
          openHostAlert(
            `참여한 순서대로 '${participants.participants[0].nickname}'님이 방장이 되었어요`,
          );
        } else {
          openExitAlert(`'${exitUserNickname}'님이 퇴장했어요`);
        }
      },
      finish: () => {
        logger.debug('finishLetter response');
        setViewDelete(true);
      },
      start: () => {
        logger.debug('startLetter response');
        navigate('/connection', {
          state: {
            letterId,
            coverId: Number(localStorage.getItem('coverId')),
            bg: localStorage.getItem('bgImg'),
          },
        });
      },
    });

    return () => {
      logger.debug('unsubscribe call from useEffect');
      unsubscribe();
    };
  }, []);

  return (
    <BackGround>
      {isExitAlertOpen && <ExitAlert>{exitUser}</ExitAlert>}
      {isHostAlertOpen && <HostAlert>{hostAlert}</HostAlert>}
      {isRoomMaster ? (
        <HostUser
          guideOpen={guideOpen}
          items={participants.participants}
          letterId={letterId}
          viewDelete={viewDelete}
          setViewDelete={setViewDelete}
          hostname={myPageData?.name ?? ''}
        />
      ) : (
        <Member
          letterId={letterId}
          guideOpen={guideOpen}
          items={participants.participants}
          viewDelete={viewDelete}
        />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background:
    url(${texture}) 0 0 / auto auto repeat,
    /* 질감 이미지 크기 자동 조정 */ #d3edff; /* 기본 배경색 */

  background-blend-mode: overlay;
`;

const HostAlert = styled.div`
  position: absolute;
  top: 110px;
  left: 50%;
  z-index: 100;

  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: var(--Border-Radius-radius_300, 8px) 20px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #fff;

  text-align: center;
  letter-spacing: -0.5px;
  white-space: nowrap;

  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;

  transform: translateX(-50%);
`;
const ExitAlert = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  z-index: 100;

  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: var(--Border-Radius-radius_300, 8px) 20px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #fff;

  text-align: center;
  letter-spacing: -0.5px;

  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;

  transform: translateX(-50%);
`;
