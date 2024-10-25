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

export const Write = () => {
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector(selectParsedData);
  const [letterItems, setLetterItems] = useState<LetterItem[]>(data);

  if (!letterNumId) {
    return <div>Error: 잘못된 접근입니다.</div>;
  }

  useEffect(() => {
    const client = stompClient();

    client.onConnect = () => {
      client.subscribe(`/topic/letter/${letterNumId}`, (message: any) => {
        const response = JSON.parse(message.body);

        if (response.action === 'EXIT') {
          console.log("퇴장액션");
        } else {
          dispatch(addData(response));
        }
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [dispatch, letterNumId]);

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

  const handleClearData = () => {
    dispatch(clearData());
  };

  const handleWritePage = () => {
    console.log(letterNumId);
    navigate('/write/element/' + letterId);
  };

  return (
    <Container>
      <StickyHeader>
        <WriteOrderTitle title="생일 축하 메시지" />
      </StickyHeader>
      <ScrollableOrderList>
        <WriteOrderList letterItems={letterItems} nowItemId={undefined} />
      </ScrollableOrderList>
      <StickyFooter>
        <Button text="작성하기" color="#FCFFAF" onClick={handleWritePage} />
      </StickyFooter>
    </Container>
  );
};

export default Write;

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
