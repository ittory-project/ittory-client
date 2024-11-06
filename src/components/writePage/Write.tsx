import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { addData, AppDispatch, clearData, clearOrderData, selectParsedData, selectParsedOrderData, setOrderData } from '../../api/config/state';
import { LetterPartiListGetResponse, LetterStartInfoGetResponse } from '../../api/model/LetterModel';
import { stompClient } from '../../api/config/stompInterceptor';
import { decodeLetterId } from '../../api/config/base64';
import Button from '../common/Button';

import { WriteOrderList } from './writeMainList/WriteOrderList';
import { WriteOrderTitle } from './WriteOrderTitle';
import { getLetterPartiList, getLetterStartInfo } from '../../api/service/LetterService';
import { WriteLocation } from './WriteLocation';
import { getUserId } from '../../api/config/setToken';
import { LetterItem, WsExitResponse } from '../../api/model/WsModel';
import { Client } from '@stomp/stompjs';
import { WriteElement } from './writeElement/WriteElement';

interface WriteElementProps {
  progressTime: number;
  setProgressTime: React.Dispatch<React.SetStateAction<number>>;
  letterTitle: string;
}

// 작성 현황을 볼 수 있는 페이지
// /write/:letterId
// letterId: base64로 인코딩한 편지 아이디
// [TODO]: 다음 차례로 넘어갔을 때 setProgressTime을 통해 타이머 리셋
export const Write = ({ progressTime, setProgressTime, letterTitle }: WriteElementProps) => {
  // redux 사용을 위한 dispatch
  const dispatch = useDispatch<AppDispatch>();
  // 편지 아이디 식별
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  // redux 값 가져오기
  const data = useSelector(selectParsedData);
  const [letterItems, setLetterItems] = useState<LetterItem[]>(data);
  // 진행 순서
  const orderData = useSelector(selectParsedOrderData);
  // const [writeOrderList, setWriteOrderList] = useState<LetterPartiItem[]>(orderData)
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
  // 작성 페이지 보여주기
  const [showSubmitPage, setShowSubmitPage] = useState(false);

  // 잘못 접근하면 화면 띄우지 않게 하려고 - 임시방편
  if (!letterNumId) {
    return <div>Error: 잘못된 접근입니다.</div>;
  } 
  
  const clientRef = useRef<Client | null>(null);
  // 외부 값 받아오기 위해 구독만 + 퇴장 감지
  useEffect(() => {
    const client = stompClient();
    clientRef.current = client;
    client.onConnect = () => {
      client.subscribe(`/topic/letter/${letterNumId}`, (message: any) => {
        const response: LetterItem | WsExitResponse = JSON.parse(message.body);

        if ('action' in response && response.action === 'EXIT') {
          fetchParticipantsAndUpdateLockedItems();
        } else if ('elementId' in response) {
          const letterResponse = response as LetterItem;
          console.log('작성 내용: ', letterResponse)
          dispatch(addData(letterResponse));
          setLetterItems((prevItems) => [...prevItems, letterResponse]);
          updateOrderAndLockedItems();
          setShowSubmitPage(false)
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

  // 현재 반복 순서, 현재 멤버 아이디, 현재 편지 아이디 세팅
  const updateOrderAndLockedItems = async () => {
    console.log("리덕스에서 잘 불러왔나요?: ", orderData);
    if (orderData) {
      const currentIndex = orderData.findIndex(item => item.sequence === nowSequence);
      let nextIndex = (currentIndex + 1) % orderData.length;
      // 상태 업데이트
      setNowSequence(orderData[nextIndex].sequence);
      setNowMemberId(orderData[nextIndex].memberId);
      setNowLetterId(prevNowLetterId => prevNowLetterId + 1);

      if (currentIndex >= orderData.length - 1) {
        console.log("그러니까 이걸 올리기라도 하는지 의문임", nowRepeat + 1)
        setNowRepeat(prevNowRepeat => prevNowRepeat + 1);
      }
      console.log("아무튼 상태 업데이트를 완료하긴 함")
    }
  };

  useEffect(() => {
    console.log(`현재 반복 상태: ${nowRepeat}, 현재 진행하는 유저의 순서: ${nowSequence}, 현재 진행하는 유저의 아이디: ${nowMemberId}, 편지인덱스: ${nowLetterId}`)
  }, [nowSequence, nowMemberId, nowLetterId, nowRepeat])

  // 참여자 리스트를 불러와서 다시 세팅하고, 잠금 아이템을 표시한다.
  const fetchParticipantsAndUpdateLockedItems = async () => {
    const response: LetterPartiListGetResponse = await getLetterPartiList(letterNumId);
    setPartiNum(response.participants.length);
    dispatch(setOrderData(response.participants))
    
    // writeOrderList가 업데이트 된 후에 locked items 세팅
    setLockedWriteItems();
  };

  const fetchRepeatCount = async () => {
    const info: LetterStartInfoGetResponse = await getLetterStartInfo(letterNumId);
    setRepeatNum(info.repeatCount)
  }

  // 참여자 목록 불러오기
  // 컴포넌트가 처음 렌더링될 때 참여자 목록을 불러옵니다.
  useEffect(() => {
    const initialize = async () => {
      await fetchParticipantsAndUpdateLockedItems(); 
      await fetchRepeatCount();

      if (orderData) {
        setNowMemberId(orderData[0].memberId);
        setNowSequence(orderData[0].sequence);
      }
    };
    initialize();
  }, []);
  
  
  // 아직 안 쓴 유저들 리스트 보여주기용 잠금 아이템 만들기
  const setLockedWriteItems = () => {
    console.log("잠금 리스트 설정할 때 잘 들어가 있나요", orderData)
    const nowItem: LetterItem = {
      elementId: `${nowLetterId + 1}`,
      imageUrl: `어너미친거야`, // writeOrderList[nowMemberId].imageUrl,
      nickname: `User`, // writeOrderList[nowMemberId].imageUrl
      elementSequence: 1,
      writeSequence: 1,
    };
    console.log(`총 반복해야 하는 횟수: ${repeatNum}, 현재 반복 상태: ${nowRepeat}, 참여자 수: ${partiNum}, 현재 진행하는 유저의 순서: ${nowSequence}, 현재 진행하는 유저의 아이디: ${nowMemberId}`)
    const tempItemNum = (repeatNum - nowRepeat) * partiNum + (partiNum - nowSequence)
    const tempItems: LetterItem[] = Array.from({ length: tempItemNum }, (_, index) => ({
      elementId: `${nowLetterId + index + 2}`
    }));
    setLockedItems([nowItem, ...tempItems]);
  };
  useEffect(() => {
    const setRepeatNum = async () => {
      await fetchRepeatCount()
    }
    setRepeatNum()
    console.log('repeatNum 설정: ', repeatNum)
    console.log('writeOrderList가 업데이트 됨:', orderData);
    setLockedWriteItems(); 
  }, [nowRepeat, partiNum, nowSequence, nowLetterId]);

  // 처음에 시작하기 전 페이지에 이거 넣기
  const handleClearData = () => {
    dispatch(clearOrderData())
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
  };

  return orderData ? 
    (
      <Container>
        <StickyHeader>
          <WriteOrderTitle writeOrderList={orderData} title={letterTitle} />
        </StickyHeader>
        <ScrollableOrderList>
          <button onClick={handleClearData}>삭삭제wp</button>
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
        {showSubmitPage && (
          <ModalOverlay>
            <WriteElement nowSequence={nowSequence} setShowSubmitPage={setShowSubmitPage} progressTime={progressTime} clientRef={clientRef}/>
          </ModalOverlay>
        )}
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

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;
