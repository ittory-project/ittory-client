import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { addData, clearData, selectParsedData } from '../../api/config/state';
import { LetterPartiItem, LetterPartiListGetResponse } from '../../api/model/LetterModel';
import { stompClient } from '../../api/config/stompInterceptor';
import { decodeLetterId, encodeLetterId } from '../../api/config/base64';
import Button from '../common/Button';

import { WriteOrderList } from './writeMainList/WriteOrderList';
import { WriteOrderTitle } from './WriteOrderTitle';
import { getLetterPartiList } from '../../api/service/LetterService';
import { WriteLocation } from './WriteLocation';
import { getUserId } from '../../api/config/setToken';
import { LetterItem, WsExitResponse } from '../../api/model/WsModel';

interface WriteElementProps {
  setShowSubmitPage: React.Dispatch<React.SetStateAction<boolean>>;
  progressTime: number;
  setProgressTime: React.Dispatch<React.SetStateAction<number>>;
  repeatCount: number;
}

// 작성 현황을 볼 수 있는 페이지
// /write/:letterId
// letterId: base64로 인코딩한 편지 아이디
// [TODO]: 다음 차례로 넘어갔을 때 setProgressTime을 통해 타이머 리셋
export const Write = ({ setShowSubmitPage, progressTime, setProgressTime, repeatCount }: WriteElementProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 편지 아이디 식별
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  // redux 값 가져오기
  const data = useSelector(selectParsedData);
  const [letterItems, setLetterItems] = useState<LetterItem[]>(data);
  // 진행 순서
  const [writeOrderList, setWriteOrderList] = useState<LetterPartiItem[]>()
  // 현재 유저의 멤버 아이디
  const [nowMemberId, setNowMemberId] = useState(4);
  // 현재까지 작성된 편지 수 (최근 작성 완료된 편지의 elementSequence 값)
  const [nowLetterId, setNowLetterId] = useState(0);
  // 현재 유저 순서(sequence)
  const [nowSequence, setNowSequence] = useState(1);
  // 현재 반복 횟수
  const [nowRepeat, setNowRepeat] = useState(1);
  // 총 참여자 수
  const [partiNum, setPartiNum] = useState(-1)
  // 총 반복 횟수
  const [repeatNum, setRepeatNum] = useState(-1)
  // 잠금된 아이템
  const [lockedItems, setLockedItems] = useState<LetterItem[]>([]);

  // 잘못 접근하면 화면 띄우지 않게 하려고 - 임시방편
  if (!letterNumId) {
    return <div>Error: 잘못된 접근입니다.</div>;
  }

  // 외부 값 받아오기 위해 구독만 + 퇴장 감지
  // [안중요 TODO]: Service로 빼고 싶음... 하지만 방법을 찾지 못함
  useEffect(() => {
    const client = stompClient();
    client.onConnect = () => {
      client.subscribe(`/topic/letter/${letterNumId}`, (message: any) => {
        const response: LetterItem | WsExitResponse = JSON.parse(message.body);

        if ('action' in response && response.action === 'EXIT') {
          fetchParticipantsAndUpdateLockedItems();
        } else if ('elementId' in response) {
          const letterResponse = response as LetterItem;
          dispatch(addData(letterResponse));
          setLetterItems((prevItems) => [...prevItems, letterResponse]);
          updateOrderAndLockedItems(letterResponse);
        }
      });
    };
    client.activate();
    return () => {
      (async () => {
        client.deactivate();
      })();
    };
  }, [dispatch, letterNumId]);

  const updateOrderAndLockedItems = (newItem: LetterItem) => {
    if (writeOrderList) {
    const currentIndex = writeOrderList.findIndex(item => item.sequence === nowSequence);
      let nextIndex = (currentIndex + 1) % writeOrderList.length;
      setNowSequence(writeOrderList[nextIndex].sequence);
      setNowMemberId(writeOrderList[nextIndex].memberId);
      setNowLetterId(Number(newItem.elementId));
    setLockedWriteItems();
    }
  };

  const fetchParticipantsAndUpdateLockedItems = async () => {
    const response: LetterPartiListGetResponse = await getLetterPartiList(letterNumId);
    setWriteOrderList(response.participants);
    setLockedWriteItems();
  };

  useEffect(() => {
    const initialize = async () => {
      const response: LetterPartiListGetResponse = await getLetterPartiList(letterNumId);
      setWriteOrderList(response.participants);
      setPartiNum(response.participants.length);
      if (response.participants.length > 0) {
        setNowMemberId(response.participants[0].memberId);
      }
    };
    initialize();
  }, [letterNumId]);
  
  // 아직 안 쓴 유저들 리스트 보여주기용 잠금 아이템 만들기
  // [TODO]: 앞으로 남은 갯수 제대로 계산해야 함
  // [TODO]: 현재 아이템을 정확한 값으로 넣어야 함
  const setLockedWriteItems =() => {
    const nowItem: LetterItem = {
      elementId: `${nowLetterId + 1}`,
      imageUrl: `https://example.com/img`,
      nickname: `User`,
      elementSequence: 1,
      writeSequence: 1,
    };
    const tempItemNum = (repeatCount - nowRepeat) * partiNum + (partiNum - nowSequence) - 1
    const tempItems: LetterItem[] = Array.from({ length: tempItemNum }, (_, index) => ({
      elementId: `${nowLetterId + index + 2}`
    }));
    setLockedItems([nowItem, ...tempItems]);
  };
  useEffect(() => {
    setLockedWriteItems();
  }, [nowRepeat, partiNum, nowSequence]);

  // 처음에 시작하기 전 페이지에 이거 넣기
  const handleClearData = () => {
    dispatch(clearData());
  };

  // 위치 버튼 누르면 그 부분으로 이동하는 액션
  const [nowItemId, setNowItemId] = useState<number | undefined>(undefined);
  const goWritePage = () => {
    handleScrollTo(nowLetterId + 1)
    setTimeout(() => {
      setNowItemId(undefined);
    }, 1000);
  }
  const handleScrollTo = (id: number) => {
    setNowItemId(id);
  };

  // 작성 페이지 이동
  const handleWritePage = () => {
    setShowSubmitPage(true)
    navigate(`/write/${encodeLetterId(letterNumId)}/sub/${nowRepeat}/${nowSequence}`);
  };

  return writeOrderList ? 
    (
      <Container>
        <StickyHeader>
          <WriteOrderTitle writeOrderList={writeOrderList} title="생일 축하 메시지" />
        </StickyHeader>
        <ScrollableOrderList>
          <button onClick={handleClearData}>삭삭제</button>
          <WriteOrderList letterItems={[...letterItems, ...lockedItems]} nowItemId={nowItemId} progressTime={progressTime}/>
        </ScrollableOrderList>
        { nowMemberId === Number(getUserId()) ? 
          <ButtonContainer>
            <Button text="작성하기" color="#FCFFAF" onClick={handleWritePage} />
          </ButtonContainer>
          : <LocationContainer onClick={goWritePage}>
              <WriteLocation progressTime={progressTime} name="카리나"/>
            </LocationContainer>
        }
      </Container>
    )
    : <>접속 오류</>
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  background-color: #212529;
  display: flex;
  flex-direction: column;
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 10px;
  z-index: 3;
`;

const ScrollableOrderList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
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
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 3;
  background-color: transparent;
`;
