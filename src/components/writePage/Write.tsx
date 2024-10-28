import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { addData, clearData, LetterItem, selectParsedData } from '../../api/config/state';
import { LetterPartiItem, LetterPartiListGetResponse } from '../../api/model/LetterModel';
import { stompClient } from '../../api/config/stompInterceptor';
import { decodeLetterId } from '../../api/config/base64';
import Button from '../common/Button';

import { WriteOrderList } from './writeMainList/WriteOrderList';
import { WriteOrderTitle } from './WriteOrderTitle';
import { getLetterPartiList } from '../../api/service/LetterService';
import { WriteLocation } from './WriteLocation';
import { getUserId } from '../../api/config/setToken';

interface WriteElementProps {
  setShowSubmitPage: React.Dispatch<React.SetStateAction<boolean>>;
}

// 작성 현황을 볼 수 있는 페이지
// /write/:letterId
// letterId: base64로 인코딩한 편지 아이디
export const Write = ({ setShowSubmitPage }: WriteElementProps) => {
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
  const [nowMemberId, setNowMemberId] = useState(-1);
  // 현재까지 작성된 편지 수 (최근 작성 완료된 편지의 elementSequence 값)
  const [nowLetterId, setNowLetterId] = useState(0);

  // 잘못 접근하면 화면 띄우지 않게 하려고 - 임시방편
  if (!letterNumId) {
    return <div>Error: 잘못된 접근입니다.</div>;
  }

  // 외부 값 받아오기 위해 구독만 + 퇴장 감지
  // Service로 빼고 싶음... 하지만 방법을 찾지 못함
  useEffect(() => {
    const client = stompClient();

    client.onConnect = () => {
      client.subscribe(`/topic/letter/${letterNumId}`, (message: any) => {
        const response = JSON.parse(message.body);

        // [TODO]: Exit response json 객체 만들기
        if (response.action === 'EXIT') {
          console.log("퇴장 모달 띄우기");
          // getPartiList가 잘 불러와진 다음에 getUserWriteState를 통해 세팅
          const fetchPartiList = async () => {
            await getPartiList();
            if (writeOrderList && writeOrderList.length > 0) {
              getUserWriteState()
            }
          };
          fetchPartiList()
        } else {
          dispatch(addData(response))
          setNowLetterId(response.writeSequence)
          getUserWriteState()
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
      setLockedWriteItems()
    }
  }
  useEffect(() => { // 처음에만 이펙트 통해서 getPartiList 호출 + 첫번째 유저로 nowMemberId 초기화
    const fetchPartiList = async () => {
      await getPartiList();
      if (writeOrderList && writeOrderList.length > 0) {
        setNowMemberId(writeOrderList[0].memberId);
        getUserWriteState()
      }
    };
    fetchPartiList();
  }, []);

  // 현재 유저가 어떤 상태인지 확인
  const getUserWriteState = () => {
    if (!writeOrderList) return null;
  
    // 현재 아이템 찾기: nowMemberId와 동일한 memberId를 가진 아이템의 인덱스
    const index = writeOrderList.findIndex(item => item.memberId === nowMemberId);
  
    if (index !== -1) {
      // 다음, 다다음 아이템의 인덱스. 마지막 아이템 순환
      const nextIndex = (index + 1) % writeOrderList.length;
      const nextNextIndex = (nextIndex + 1) % writeOrderList.length;
  
      return {
        nextItem: writeOrderList[nextIndex], // 다음 아이템
        nextItemMemberId: writeOrderList[nextIndex].memberId, // 다음 아이템의 memberId
        nextNextItemMemberId: writeOrderList[nextNextIndex].memberId // 다다음 아이템의 memberId
        // [TODO]: 다음 아이템 - 현재 아이템 생성할 때 값 넣어주기
        // [TODO]: 다다음 아이템 - 이 페이지에서 알림창 띄우는 것 만들기
      };
    }
  
    return null;
  };

  // 아직 안 쓴 유저들 리스트 보여주기용 잠금 아이템 만들기
  // [TODO]: 리셋되는 것이 아닌, 계속 밑에 추가가 되는 문제 해결해야 함
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
    navigate(`/write/MQ==/sub`);
  };

  // 시간 계산
  const [progressTime, setProgressTime] = useState(100);
  useEffect(() => {
    const totalDuration = 100000;
    const interval = setInterval(() => {
      setProgressTime(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, totalDuration / 1000);

    return () => clearInterval(interval);
  }, []);

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
