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
  const wsApi = getWebSocketApi();
  const params = useParams<{
    letterId: string;
  }>();
  const letterId = Number(params.letterId);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const guideOpen = searchParams.get('guideOpen') === 'true';

  const queryClient = useQueryClient();
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
  const isAlreadyJoined =
    participants.participants.findIndex(
      (participant) => participant.memberId === myPageData.memberId,
    ) >= 0;

  useEffect(function handleWebSocketJobs() {
    if (!isAlreadyJoined) {
      wsApi.send('enterLetter', [letterId], { nickname: myPageData.name });
    }

    const unsubscribe = wsApi.subscribe('letter', [letterId], {
      enter: (response: WsEnterResponse) => {
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
        // NOTE: participants가 변경될 때마다 UNSUB-SUB을 할 수는 없음
        // FIXME: queryOption으로 변경해 타입 안정성 개선
        const participants =
          queryClient.getQueryData<LetterPartiListGetResponse>(
            letterQuery.queryKeys.participantsById(letterId),
          );

        const exitUserNickname = participants?.participants.find(
          (participant) => participant.memberId === response.exitMemberId,
        )?.nickname;

        if (response.isManager) {
          openExitAlert(`방장 '${exitUserNickname}'님이 퇴장했어요`);
          openHostAlert(
            `참여한 순서대로 '${participants?.participants[1]?.nickname}'님이 방장이 되었어요`,
          );
          queryClient.invalidateQueries({
            queryKey: letterQuery.queryKeys.participantsById(letterId),
          });
        } else {
          openExitAlert(`'${exitUserNickname}'님이 퇴장했어요`);
          queryClient.invalidateQueries({
            queryKey: letterQuery.queryKeys.participantsById(letterId),
          });
        }
      },
      delete: () => {
        setViewDelete(true);
      },
      start: async () => {
        await queryClient.invalidateQueries({
          queryKey: letterQuery.queryKeys.participantsById(letterId),
        });

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
      {/* FIXME: 방장이 되면 가이드가 서로 다른 컴포넌트가 마운트/언마운트 되면서 다시 표시됨 - 두 컴포넌트를 하나로 합치거나 guideOpen 부분을 하나로 합쳐야 함 */}
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
