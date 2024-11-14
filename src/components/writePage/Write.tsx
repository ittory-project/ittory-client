import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import styled from 'styled-components';

import { addData, AppDispatch, clearData, clearOrderData, selectParsedData, selectParsedOrderData, setOrderData } from '../../api/config/state';
import { LetterItem, LetterPartiItem, LetterPartiListGetResponse, LetterStartInfoGetResponse } from '../../api/model/LetterModel';
import { getLetterPartiList, getLetterStartInfo } from '../../api/service/LetterService';
import { stompClient } from '../../api/config/stompInterceptor';
import { LetterItemResponse, WsExitResponse } from '../../api/model/WsModel';
import { decodeLetterId } from '../../api/config/base64';
import { getUserId } from '../../api/config/setToken';
import Button from '../common/Button';

import { WriteOrderList } from './writeMainList/WriteOrderList';
import { WriteOrderTitle } from './WriteOrderTitle';
import { WriteLocation } from './WriteLocation';
import { WriteElement } from './writeElement/WriteElement';
import { WriteOrderAlert } from './WriteOrderAlert';

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
  const [writeOrderList, setWriteOrderList] = useState<LetterPartiItem[]>(orderData)
  // 현재 유저의 멤버 아이디
  const [nowMemberId, setNowMemberId] = useState(0);
  // 다음 유저의 멤버 아이디 (상단바 설정용)
  const [nextMemberId, setNextMemberId] = useState(0)
  // 현재 작성해야 하는 편지 아이디
  const storedNowLetterId = window.localStorage.getItem('nowLetterId')
  const [nowLetterId, setNowLetterId] = useState(Number(storedNowLetterId || 1));
  // 현재 유저 순서(sequence)
  const storedNowSequence = window.localStorage.getItem('nowSequence')
  const [nowSequence, setNowSequence] = useState(Number(storedNowSequence || 1));
  // 현재 반복 횟수
  const storedNowRepeat = window.localStorage.getItem('nowRepeat')
  const [nowRepeat, setNowRepeat] = useState(Number(storedNowRepeat || 1));
  // 전체 편지 아이템 횟수
  const storedTotalItem = window.localStorage.getItem('totalItem')
  const [totalItem, setTotalItem] = useState(Number(storedTotalItem || 1));
  // 현재 예정 편지 아이템 횟수
  const storedNowTotalItem = window.localStorage.getItem('nowTotalItem')
  const [nowTotalItem, setNowTotalItem] = useState(Number(storedNowTotalItem || 1));
  // 총 참여자 수
  const [partiNum, setPartiNum] = useState(-1)
  // 총 반복 횟수
  const [repeatNum, setRepeatNum] = useState(-1)
  // 잠금된 아이템
  const [lockedItems, setLockedItems] = useState<LetterItem[]>([]);
  // 작성 페이지 보여주기
  const [showSubmitPage, setShowSubmitPage] = useState(false);
  // updateResponse flag
  const [updateResponse, setUpdateResponse] = useState(false);

  // 잘못 접근하면 화면 띄우지 않게 하려고 - 임시방편
  if (!letterNumId) {
    return <div>Error: 잘못된 접근입니다.</div>;
  } 

  // 각각의 아이템들을 세션에서 가져올 수 있도록 하기
  useEffect(() => {
    window.localStorage.setItem('nowLetterId', String(nowLetterId))
  }, [nowLetterId])
  useEffect(() => {
    window.localStorage.setItem('nowSequence', String(nowSequence))
  }, [nowSequence])
  useEffect(() => {
    window.localStorage.setItem('nowRepeat', String(nowRepeat))
  }, [nowRepeat])
  useEffect(() => {
    window.localStorage.setItem('totalItem', "6")
  }, [totalItem])
  useEffect(() => {
    window.localStorage.setItem('nowTotalItem', String(nowTotalItem))
  }, [nowTotalItem])
  
  // 편지 데이터가 변경될 때마다 redux에서 편지 아이템들을 불러오고 세팅한다.
  useEffect (() => {
    setLetterItems(data)
  }, [data])
  // 편지 작성 순서가 변경되거나, 새로 작성이 완료됐을 때마다 Redux에서 순서를 불러오고 세팅한다. 
  useEffect (() => {
    setWriteOrderList(orderData)
    // orderData의 변경 외에, 응답이 왔을 때 응답에 대한 내용을 처라히기 위함
    if (updateResponse) {
      updateOrderAndLockedItems();
      setShowSubmitPage(false)
      setUpdateResponse(false)
      setProgressTime(100)
    }
  }, [orderData, updateResponse])

  // client 객체를 WriteElement.tsx에서도 사용해야 해서 props로 넘겨주기 위한 설정을 함
  const clientRef = useRef<Client | null>(null);
  // 외부 값 받아오기 위해 구독만 + 퇴장 감지
  useEffect(() => {
    const client = stompClient();
    clientRef.current = client;
    client.onConnect = () => {
      client.subscribe(`/topic/letter/${letterNumId}`, (message: any) => {
        const response: LetterItemResponse | WsExitResponse = JSON.parse(message.body);

        if ('action' in response && response.action === 'EXIT') {
          fetchParticipantsAndUpdateLockedItems();
        } else if ('elementId' in response) {
          const letterResponse = response as LetterItemResponse;
          console.log('작성 내용: ', letterResponse)
          console.log(`왜안되는거? ${writeOrderList[writeOrderList.findIndex(item => item.memberId === nowMemberId)].imageUrl}`)
          const responseToLetterItem: LetterItem = {
            elementId: Number(response.elementId),
            content: response.content,
            userNickname: response.content,
            userId: nowMemberId,
            letterImg: letterResponse.imageUrl,
          }          
          dispatch(addData(letterResponse));
          setLetterItems((prevItems) => [...prevItems, responseToLetterItem]);
          // 아래의 두 동작을 useState로 분리함: redux로 불러오는 것에 약간의 딜레이가 발생, useState로 저장하는 데에도 약간의 딜레이가 발생함
          // 해결방법: updateResponse라는 flag를 만들어 현재 업데이트를 해야 하는 상황인지 아닌지 판단 후 useEffect에서 실행
          // updateOrderAndLockedItems();
          // setShowSubmitPage(false)
          setUpdateResponse(true)
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
    console.log("불러오는 것도 안됨: ", orderData)
    console.log("유즈이펙트 오류: ", writeOrderList);
    if (writeOrderList) {
      const currentIndex = writeOrderList.findIndex(item => item.sequence === nowSequence);
      let nextIndex = (currentIndex + 1) % writeOrderList.length;
      // 상태 업데이트
      setNowSequence(writeOrderList[nextIndex].sequence);
      setNowMemberId(writeOrderList[nextIndex].memberId);
      setNextMemberId(writeOrderList[(nextIndex+1) % partiNum].memberId);
      setNowLetterId(prevNowLetterId => prevNowLetterId + 1);

      if (currentIndex >= writeOrderList.length - 1) {
        setNowRepeat(prevNowRepeat => prevNowRepeat + 1);
      }
      console.log("아무튼 상태 업데이트를 완료하긴 함")
    }
  };

  useEffect(() => {
    console.log(`현재 반복 상태: ${nowRepeat}, 현재 진행하는 유저의 순서: ${nowSequence}, 현재 진행하는 유저의 아이디: ${nowMemberId}, 편지인덱스: ${nowLetterId}`)
    console.log(`다음 멤버 아이디: ${nextMemberId}, 나: ${nowMemberId}`)
  }, [nowSequence, nowMemberId, nowLetterId, nowRepeat])

  // 참여자 리스트를 불러와서 다시 세팅하고, 잠금 아이템을 표시한다.
  const fetchParticipantsAndUpdateLockedItems = async () => {
    const response: LetterPartiListGetResponse = await getLetterPartiList(letterNumId);
    setPartiNum(response.participants.length);
    dispatch(setOrderData(response.participants))
    // 계산 로직: 수정해야
    console.log(`현재 작성 숫자: ${nowLetterId}, 현재 총 아이템 수: ${nowLetterId + (partiNum - nowSequence) + totalItem - nowLetterId - (totalItem - nowLetterId) % partiNum}`)
    setNowTotalItem(nowLetterId + (partiNum - nowSequence) + totalItem - nowLetterId - (totalItem - nowLetterId) % partiNum)
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

      if (writeOrderList) {
        setNowMemberId(writeOrderList[0].memberId);
        setNextMemberId(writeOrderList[1 % partiNum].memberId)
        setNowSequence(writeOrderList[0].sequence);
      }
    };
    initialize();
  }, []);
  
  // 아직 안 쓴 유저들 리스트 보여주기용 잠금 아이템 만들기
  const setLockedWriteItems = () => {
    console.log("잠금 리스트 설정할 때 잘 들어가 있나요", writeOrderList)
    const tempItemNum = nowTotalItem - nowLetterId
    
    const currentIndex = writeOrderList.findIndex(item => item.sequence === nowSequence);
    const nowItem: LetterItem = {
      elementId: nowLetterId,
      userNickname: writeOrderList[currentIndex].nickname || `유저 ${writeOrderList[currentIndex].sequence}`,
    };
    console.log(`총 반복해야 하는 횟수: ${repeatNum}, 현재 반복 상태: ${nowRepeat}, 참여자 수: ${partiNum}, 현재 진행하는 유저의 순서: ${nowSequence}, 현재 진행하는 유저의 아이디: ${nowMemberId}`)
    const tempItems: LetterItem[] = Array.from({ length: tempItemNum }, (_, index) => ({
      elementId: nowLetterId + index + 1
    }));
    
    if (tempItemNum < 0) {
      setLockedItems([]);
    } else {
      setLockedItems([nowItem, ...tempItems]);
    }
  };
  useEffect(() => {
    const setRepeatNum = async () => {
      await fetchRepeatCount()
    }
    setRepeatNum()
    console.log("Redux에서 불러온 값: ", orderData)
    console.log('writeOrderList가 업데이트 됨:', writeOrderList);
    setLockedWriteItems(); 
  }, [nowRepeat, partiNum, nowSequence, nowLetterId]);

  // 처음에 시작하기 전 페이지에 이거 넣기
  const handleClearData = () => {
    dispatch(clearOrderData())
    dispatch(clearData());
    window.localStorage.setItem('nowLetterId', "1")
    window.localStorage.setItem('nowSequence', "1")
    window.localStorage.setItem('nowRepeat', "1")
    window.localStorage.setItem('totalItem', "1")
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

  // 데이터 삭제버튼
  // <button onClick={handleClearData}>삭삭제</button>
  return writeOrderList ? 
    (
      <Container>
        <StickyHeader>
          <WriteOrderTitle writeOrderList={writeOrderList} title={letterTitle} />
        </StickyHeader>
        <AlertContainer>
          { Number(getUserId()) === nextMemberId && <WriteOrderAlert name={writeOrderList[writeOrderList.findIndex(item => item.sequence === nowSequence)].nickname} isOrderAlert={true} /> }
          { true && <WriteOrderAlert name="퇴장닉네임" isOrderAlert={false}/> }
          <button onClick={handleClearData}>삭삭제</button>
        </AlertContainer>
        <ScrollableOrderList>
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
            <WriteElement sequence={nowLetterId} setShowSubmitPage={setShowSubmitPage} progressTime={progressTime} clientRef={clientRef}/>
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

const AlertContainer = styled.div`
  position: absolute;
  top: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 3;
  padding: 0px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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
