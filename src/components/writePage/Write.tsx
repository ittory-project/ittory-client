import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { addData, clearData, selectParsedData } from '../../api/config/state';
import { LetterPartiItem, LetterPartiListGetResponse } from '../../api/model/LetterModel';
import { stompClient } from '../../api/config/stompInterceptor';
import { decodeLetterId } from '../../api/config/base64';
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
  partiCount: number;
  repeatCount: number;
}

// 작성 현황을 볼 수 있는 페이지
// /write/:letterId
// letterId: base64로 인코딩한 편지 아이디
// [TODO]: 다음 차례로 넘어갔을 때 setProgressTime을 통해 타이머 리셋
export const Write = ({ setShowSubmitPage, progressTime, setProgressTime, partiCount, repeatCount }: WriteElementProps) => {
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
  const [nowMemberId, setNowMemberId] = useState(0);
  // 현재까지 작성된 편지 수 (최근 작성 완료된 편지의 elementSequence 값)
  const [nowLetterId, setNowLetterId] = useState(0);
  // 현재 유저 순서(sequence)
  const [nowSequence, setNowSequence] = useState(1);
  // 현재 반복 횟수
  const [nowRepeat, setNowRepeat] = useState(1);

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
          console.log("퇴장 모달 띄우기");
          // getPartiList가 잘 불러와진 다음에 getUserWriteState를 통해 세팅
          const fetchPartiList = async () => {
            await getPartiList();
            if (writeOrderList && writeOrderList.length > 0) {
              setLockedWriteItems()
            }
          };
          fetchPartiList();
        } else { // 작성 완료 response 감지 시
          const letterResponse = response as LetterItem;
          dispatch(addData(letterResponse));
          // [안중요 TODO]: letterResponse의 writeSequence가 null일수도 있기 때문에 Number로 묶어줬는데, 더 적절한 조치가 필요 
          setNowLetterId(Number(letterResponse.writeSequence));
          
          if (writeOrderList && writeOrderList.length > 0) {
            // 현재 nowSequence와 일치하는 writeOrder의 인덱스 찾기
            const currentIndex = writeOrderList.findIndex(item => item.sequence === nowSequence);
            // 다음 인덱스 계산
            const nextIndex = currentIndex === -1 || currentIndex === writeOrderList.length - 1 ? 0 : currentIndex + 1;
            // 마지막 인덱스에서 첫 번째로 돌아갈 경우 writeSequence 증가
            if (nextIndex === 0 && currentIndex === writeOrderList.length - 1) {
              setNowRepeat(nowRepeat + 1);
            }
            // nowSequence에 다음 sequence, 멤버아이디 값 할당
            setNowSequence(writeOrderList[nextIndex].sequence);
            setNowMemberId(writeOrderList[nextIndex].memberId);
          }          

          if (nowRepeat > repeatCount) {
            console.log("끝")
          }
          setLockedWriteItems()
        }
      });
    };
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [dispatch, letterNumId]);

  // 참여자 목록 불러오기
  const getPartiList = async () => {
    if (!letterId) {
      window.alert("잘못된 접근입니다.")
    } else if (!letterNumId) {
      window.alert("잘못된 접근입니다.")
    } else {
      const response: LetterPartiListGetResponse = await getLetterPartiList(letterNumId);
      setWriteOrderList(response.participants)
      // 아직 작성 안 한 아이템들 세팅
      setLockedWriteItems()
    }
  }
  useEffect(() => { // 처음에만 이펙트 통해서 getPartiList 호출 + 첫번째 유저로 nowMemberId 초기화
    const fetchPartiList = async () => {
      await getPartiList();
      if (writeOrderList && writeOrderList.length > 0) {
        setNowMemberId(writeOrderList[0].memberId);
      }
    };
    fetchPartiList();
  }, []);

  // 아직 안 쓴 유저들 리스트 보여주기용 잠금 아이템 만들기
  // [TODO]: 앞으로 남은 갯수 제대로 계산해야 함
  // [TODO]: 현재 아이템을 정확한 값으로 넣어야 함
  const setLockedWriteItems =() => {
    const nowItem: LetterItem = {
      elementId: `${nowLetterId + 1}`,
      imageUrl: `https://example.com/img`,
      content: `Temporary Content`,
      nickname: `User`,
      elementSequence: 1,
      writeSequence: 1,
    };    
    const tempItems: LetterItem[] = Array.from({ length: 10 }, (_, index) => ({
      elementId: `${nowLetterId + index + 2}`
    }));
    setLetterItems([...data, nowItem]);
    setLetterItems((prevItems) => [...prevItems, ...tempItems]);
  };

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
    navigate(`/write/OA==/sub`);
  };

  return writeOrderList ? 
    (
      <Container>
        <StickyHeader>
          <WriteOrderTitle writeOrderList={writeOrderList} title="생일 축하 메시지" />
        </StickyHeader>
        <ScrollableOrderList>
          <WriteOrderList letterItems={letterItems} nowItemId={nowItemId} progressTime={progressTime}/>
        </ScrollableOrderList>
        { nowMemberId !== Number(getUserId()) ? 
          <ButtonContainer>
            <Button text="작성하기" color="#FCFFAF" onClick={handleWritePage} />
          </ButtonContainer>
          : <LocationContainer onClick={goWritePage}>
              <WriteLocation progressTime={progressTime} name="카리나"/>
            </LocationContainer>
        }
      </Container>
    )
    : <>오류염</>
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
