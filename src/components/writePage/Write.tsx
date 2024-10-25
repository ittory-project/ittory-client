import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { addData, clearData, LetterItem, selectParsedData } from '../../api/config/state';
import Button from '../common/Button';
import { WriteOrderList } from './writeMainList/WriteOrderList';
import { WriteOrderTitle } from './WriteOrderTitle';
import { stompClient } from '../../api/config/stompInterceptor';
import { useNavigate, useParams } from 'react-router-dom';
import { decodeLetterId } from '../../api/config/base64';
import { LetterPartiItem, LetterPartiListGetResponse } from '../../api/model/LetterModel';
import { getLetterPartiList } from '../../api/service/LetterService';

export const Write = () => {
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector(selectParsedData);
  const [letterItems, setLetterItems] = useState<LetterItem[]>(data);
  const [writeOrderList, setWriteOrderList] = useState<LetterPartiItem[]>()

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

        if (response.action === 'EXIT') {
          console.log("퇴장 모달 띄우기");
          // [TODO]: 참여자 리스트 갱신하기
          getPartiList()
          // [TODO]: response의 멤버 데이터를 이용하여 유저 상태 확인
        } else {
          dispatch(addData(response));
          // [TODO]: response의 멤버 데이터를 이용하여 유저 상태 확인
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
    }
  }
  useEffect(() => {
    getPartiList()
  }, []);

  // 현재 유저가 어떤 상태인지 확인
  const getUserWriteState = (nowMemberId: number) => {
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
        // [TODO]: 다음 아이템 - 리스트 컴포넌트에서 현재 아이디 처리하고, 그게 나인지도 처리함: 밑으로 보내줘야 함
        // [TODO]: 다다음 아이템 - 이 페이지에서 알림 보내줌: 여기에서 처리
      };
    }
  
    return null;
  };
  

  // 아직 안 쓴 유저들 리스트 보여주기용 잠금 아이템 만들기
  // [TODO]: 앞으로 남은 갯수 제대로 계산해야 함
  useEffect(() => {
    const tempItems: LetterItem[] = Array.from({ length: 10 }, (_, index) => ({
      elementId: `${index + 1}`,
      imageUrl: `https://example.com/image${index + 1}.jpg`,
      content: `Temporary Content ${index + 1}`,
      nickname: `User${index + 1}`,
      elementSequence: index + 1,
      writeSequence: index + 1,
    }));
    
    setLetterItems((prevItems) => [...prevItems, ...tempItems]);
  }, []);

  // 처음에 시작하기 전 페이지에 이거 넣기
  const handleClearData = () => {
    dispatch(clearData());
  };

  // 작성 페이지 이동
  // [TODO]: 작성 페이지를 outlet으로 구현하면 소켓 disconnect가 되지 않을까,,,?
  const handleWritePage = () => {
    console.log(letterNumId);
    navigate('/write/element/' + letterId);
  };

  return writeOrderList ? 
    (
      <Container>
        <StickyHeader>
          <WriteOrderTitle writeOrderList={writeOrderList} title="생일 축하 메시지" />
        </StickyHeader>
        <ScrollableOrderList>
          <WriteOrderList letterItems={letterItems} nowItemId={undefined} />
        </ScrollableOrderList>
        <StickyFooter>
          <Button text="작성하기" color="#FCFFAF" onClick={handleWritePage} />
        </StickyFooter>
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
  z-index: 4;
`;

const ScrollableOrderList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin: 10px 5px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StickyFooter = styled.div`
  position: sticky;
  bottom: 10px;
  z-index: 4;
  background-color: transparent;
`;
