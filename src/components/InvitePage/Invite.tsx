import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import texture from '../../../public/assets/invite/texture1.png';
import { MypageGetResponse } from '../../api/model/MemberModel';
import { WsEnterResponse, WsExitResponse } from '../../api/model/WsModel';
import { getParticipants } from '../../api/service/LetterService';
import { getMyPage } from '../../api/service/MemberService';
import { getWebSocketApi } from '../../api/websockets';
import { SessionLogger } from '../../utils/SessionLogger';
import { HostUser } from './HostUser';
import { Loading } from './Loading';
import { Member } from './Member';

const logger = new SessionLogger('invite');

export interface Participants {
  sequence: number;
  memberId: number;
  nickname: string;
  imageUrl: string;
}

export const Invite = () => {
  const wsApi = getWebSocketApi();
  const params = useParams<{
    letterId: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const guideOpen = searchParams.get('guideOpen') === 'true';

  const [myPageData, setMyPageData] = useState<MypageGetResponse | null>(null); // TODO: useQuery로 이관
  const [participants, setParticipants] = useState<Participants[]>([]);

  const letterId = Number(params.letterId); // FIXME: 이 값으로는 조회가 안되나본데?

  logger.debug(
    'letterId',
    params,
    params.letterId,
    letterId,
    window.location.href, // https://localhost:5173/invite/3261?guideOpen=false
    location.pathname, // /invite/0 로 나오는 이유?
    location.search,
  );

  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [exitName, setExitName] = useState<string>(''); // ?
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [viewDelete, setViewDelete] = useState<boolean>(false); // 필요 여부 체크 필요함

  const isLoading = !myPageData || participants.length === 0;

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const isRoomMaster =
    participants[0] && participants[0].memberId === myPageData?.memberId;

  const refetchParticipants = useCallback(async () => {
    const data = await getParticipants(letterId);
    setParticipants(data);
  }, [letterId]);

  useEffect(
    function fetchMyPageIfNotLoaded() {
      if (!myPageData) {
        const fetchMyPage = async () => {
          const mydata = await getMyPage();
          setMyPageData(mydata);
        };
        fetchMyPage();
      }
    },
    [myPageData],
  );

  useEffect(
    function processOnMount() {
      if (!myPageData || isSubscribed) {
        return;
      }

      setIsSubscribed(true);

      logger.debug('doInviteJobs start');

      wsApi.send('enterLetter', [letterId], { nickname: myPageData.name });

      const unsubscribe = wsApi.subscribe('letter', [letterId], {
        enter: (response: WsEnterResponse) => {
          logger.debug('enterLetter response', response);
          setParticipants(response.participants);
          logger.debug(
            'after enterLetter participants',
            participants,
            response.participants,
          );
        },
        exit: async (response: WsExitResponse) => {
          logger.debug('exitLetter response', response);
          await refetchParticipants();

          if (response.isManager) {
            logger.debug('방장 퇴장 감지');
            setExitAlert(`방장 '${response.nickname}'님이 퇴장했어요`);
            await refetchParticipants();
            setHostAlert(
              `참여한 순서대로 '${participants[0].nickname}'님이 방장이 되었어요`,
            );
          } else {
            setExitAlert(`'${response.nickname}'님이 퇴장했어요`);
          }
        },
        end: () => {
          logger.debug('endLetter response');
          setViewDelete(true);
        },
        start: () => {
          logger.debug('startLetter response');
          navigate('/Connection', {
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
    },
    [
      letterId,
      navigate,
      participants,
      myPageData,
      wsApi,
      refetchParticipants,
      isLoading,
      isSubscribed,
    ],
  );

  useEffect(
    function noticeOnExit() {
      const exitTimer = setTimeout(() => {
        refetchParticipants();
        setExitAlert(null);
        if (exitName) {
          setExitName('');
        }
      }, 5000); // 5초 있다가 notice 제거하는 거였음

      return () => clearTimeout(exitTimer);
    },
    [exitAlert, refetchParticipants, exitName],
  );

  useEffect(
    function noticeOnRoomMasterChange() {
      const hostTimer = setTimeout(() => {
        refetchParticipants();
        setHostAlert(null);
      }, 10000);

      return () => clearTimeout(hostTimer);
    },
    [hostAlert, refetchParticipants],
  );

  // TODO: myData suspense 사용 및 로딩을 fallback으로 추출 (실제로 보이는 일은 없게 될 듯)
  return (
    <BackGround>
      {isLoading ? (
        <Loading loadstatus={true} />
      ) : (
        <>
          {exitAlert && <ExitAlert>{exitAlert}</ExitAlert>}
          {hostAlert && <HostAlert>{hostAlert}</HostAlert>}
          {isRoomMaster ? (
            <HostUser
              guideOpen={guideOpen}
              items={participants}
              letterId={letterId}
              viewDelete={viewDelete}
              setViewDelete={setViewDelete}
              hostname={myPageData?.name ?? ''}
            />
          ) : (
            <Member
              letterId={letterId}
              guideOpen={guideOpen}
              items={participants}
              viewDelete={viewDelete}
            />
          )}
        </>
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
  //left: 50%;
  //transform: translateX(-50%);
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
