import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import texture from '../../../public/assets/invite/texture1.png';
import { stompClient } from '../../api/config/stompInterceptor';
import { WsEnterResponse, WsExitResponse } from '../../api/model/WsModel';
import { getParticipants } from '../../api/service/LetterService';
import { getMyPage } from '../../api/service/MemberService';
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
  const location = useLocation();
  const navigate = useNavigate();

  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [memberIndex, setMemberIndex] = useState<number>(-1);
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [userId, setUserId] = useState<number>(-1);

  const getletterId = location.state.letterId;
  const userName = location.state.userName;
  const guideOpen = location.state.guideOpen;

  const [letterId] = useState<number>(getletterId);
  const [name, setName] = useState<string>('');
  const [exitName, setExitName] = useState<string>('');
  const [viewDelete, setViewDelete] = useState<boolean>(false);
  const [, setLoad] = useState<boolean>(true);
  const [loadstatus, setLoadstatus] = useState<boolean>(true);

  const fetchParticipants = async () => {
    setLoad(true);
    const data = await getParticipants(letterId);

    setParticipants(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const mydata = await getMyPage();
      const userNameFromApi = mydata.name;
      const userIdFromApi = mydata.memberId;

      setName(userNameFromApi);
      setUserId(userIdFromApi);

      if (participants.length < 1) {
        fetchParticipants();
      } else {
        if (memberIndex > -1) {
          return;
        } else {
          if (participants[0].nickname) {
            logger.debug('방장지정');
            if (
              participants[0].nickname === name ||
              participants[0].nickname === userName
            ) {
              localStorage.removeItem('load');
              setLoad(false);
              setMemberIndex(0);
            } else {
              localStorage.removeItem('load');
              setLoad(false);
              setMemberIndex(1);
            }
          } else {
            if (localStorage.getItem('load') === 'done') {
              setLoad(true);
              setLoadstatus(true);
            } else {
              localStorage.setItem('load', 'done');
              navigate('/loading', {
                state: {
                  letterId: getletterId,
                  userName: userName,
                  guideOpen: guideOpen,
                },
              });
            }
          }
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const mydata = await getMyPage();
      const userNameFromApi = mydata.name;
      const userIdFromApi = mydata.memberId;

      setName(userNameFromApi);
      setUserId(userIdFromApi);

      logger.debug('participants[0].memberId' + participants[0].memberId);
      logger.debug('userId : ' + userId);

      if (participants.length < 1) {
        fetchParticipants();
      } else {
        if (participants[0].nickname) {
          logger.debug('방장지정');
          if (participants[0].memberId === userId) {
            localStorage.removeItem('load');
            setLoad(false);
            setMemberIndex(0);
            console.log('0');
          } else {
            localStorage.removeItem('load');
            setLoad(false);
            setMemberIndex(1);
          }
        } else {
          if (localStorage.getItem('load') === 'done') {
            setLoad(true);
            setLoadstatus(true);
          } else {
            localStorage.setItem('load', 'done');
            navigate('/loading', {
              state: {
                letterId: getletterId,
                userName: userName,
                guideOpen: guideOpen,
              },
            });
          }
        }
      }
    };
    fetchData();
  }, [participants]);

  useEffect(() => {
    const client = stompClient();

    client.onConnect = () => {
      // WebSocket 구독
      client.subscribe(`/topic/letter/${letterId}`, (message) => {
        const response: WsEnterResponse | WsExitResponse = JSON.parse(
          message.body,
        );

        if (
          response.action === 'EXIT' &&
          'nickname' in response &&
          'isManager' in response
        ) {
          if (response.isManager) {
            logger.debug('방장 퇴장 감지');
            setExitAlert(`방장 '${response.nickname}'님이 퇴장했어요`);
            fetchParticipants();
            if (participants[0]) {
              setHostAlert(
                `참여한 순서대로 '${participants[0].nickname}'님이 방장이 되었어요`,
              );
            }
          } else {
            setExitAlert(`'${response.nickname}'님이 퇴장했어요`);
            fetchParticipants();
          }
        } else if (response.action === 'END') {
          setViewDelete(true);
        } else if (response.action === 'START') {
          navigate('/Connection', {
            state: {
              letterId: letterId,
              coverId: Number(localStorage.getItem('coverId')),
              bg: localStorage.getItem('bgImg'),
            },
          });
        } else if (response.action === 'ENTER' && 'participants' in response) {
          if (response.participants) {
            setParticipants(response.participants);
          }
        }
      });

      client.publish({
        destination: `/ws/letter/enter/${letterId}`,
        body: JSON.stringify({ nickname: name }),
      });
    };
    client.activate();
    return () => {
      (async () => {
        client.deactivate();
      })();
    };
  }, []);

  //퇴장 알림
  useEffect(() => {
    logger.debug('퇴장 알림');
    const exitTimer = setTimeout(() => {
      fetchParticipants();
      setExitAlert(null);
      if (exitName) {
        setExitName('');
      }
    }, 5000);

    return () => clearTimeout(exitTimer);
  }, [exitAlert]);

  //방장 바뀜 알림
  useEffect(() => {
    const hostTimer = setTimeout(() => {
      fetchParticipants();
      setHostAlert(null);
    }, 10000);

    return () => clearTimeout(hostTimer);
  }, [hostAlert]);

  //PC 감지
  const handleTabClosed = useCallback(async (event: BeforeUnloadEvent) => {
    event.preventDefault(); // 경고 메시지 표시
    event.returnValue = ''; // 일부 브라우저에서 탭을 닫을 때 경고 창을 띄움

    //quitLetterWs(letterId);
    logger.debug('탭이 닫힘');
  }, []);

  useEffect(() => {
    // 탭 닫기 전에 호출
    logger.debug('탭이 닫힘');
    const beforeUnloadListener = (event: BeforeUnloadEvent) => {
      handleTabClosed(event);
    };
    window.addEventListener('beforeunload', beforeUnloadListener);
    window.addEventListener('unload', handleTabClosed);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener);
      window.removeEventListener('unload', handleTabClosed);
      // quitLetterWs(letterId);
      // navigate('/');
    };
  }, [handleTabClosed]);

  return (
    <BackGround>
      {memberIndex < 0 ? (
        <Loading loadstatus={loadstatus} setLoad={setLoad} />
      ) : (
        <>
          {exitAlert && <ExitAlert>{exitAlert}</ExitAlert>}
          {hostAlert && <HostAlert>{hostAlert}</HostAlert>}
          {memberIndex === 0 && (
            <>
              <HostUser
                guideOpen={guideOpen}
                items={participants}
                letterId={letterId}
                viewDelete={viewDelete}
                setViewDelete={setViewDelete}
                hostname={name}
              />
            </>
          )}
          {memberIndex === 1 && (
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
