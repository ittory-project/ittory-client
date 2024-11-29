import styled from 'styled-components';
import { getLetterStorageCheck, postLetterStore } from '../../api/service/LetterService';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { decodeLetterId } from '../../api/config/base64';

type AlertState = 'LOADING' | 'SAVED' | 'ISSTORED';

export const ReceiveLetterSave = () => {
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const [saveAlert, setSaveAlert] = useState<AlertState>('LOADING');
  const [receiver] = useState('선재')

  const handleSaveLetter = async () => {
    const storeAvailableResponse = await getLetterStorageCheck(letterNumId)
    if (storeAvailableResponse.isStored) {
      const storeResponse = await postLetterStore(letterNumId);
      if (storeResponse) {
        setSaveAlert('SAVED')
      }
    } else {
      
    }
  }

  return (
    <>
      <ProductLeftSide src='/img/cover/left.svg' />
      <ProductRightSide src='/img/cover/product.svg' />
      <Content>받은 편지를<br/>간직하고 싶다면?</Content>
      <ContentImg src='/img/letter_save_contents.png'/>
      <ContentSaveBtn onClick={handleSaveLetter}>편지함에 보관하기</ContentSaveBtn>
      {saveAlert === 'SAVED' &&
        <ModalOverlay>
          <PopupContainer>
            <PopupTitle>
              {`${receiver}님만 보관할 수 있어요`}
            </PopupTitle>
            <PopupSub>
              {`받는 사람 이름을 확인해 주세요\n편지함에 보관하시겠어요?`}
            </PopupSub>
            <CancelButton>
              {`취소하기`}
            </CancelButton>
            <MoveButton>
              {`보관하기`}
            </MoveButton>
          </PopupContainer>
        </ModalOverlay>
      }
    </>
  );
};

const ProductRightSide = styled.img`
  display: flex;
  margin: 3.5px 4px 3.5px auto;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ProductLeftSide = styled.img`
  width: 67px;
  height: 369px;
  object-fit: fill;
  position: absolute;
  left: -51px;
  top: -7px;
`;

const ContentImg = styled.img`
  width: 122px;
  height: 122px;
  border-radius: 100px;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const Content = styled.div`
  color: #343A40;
  text-align: center;
  width: 150px;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-47%, -0%);
`;

const ContentSaveBtn = styled.div`
  display: flex;
  width: 130px;
  height: 20px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;

  color: #FFF;
  border-radius: 50px;
  background: #343A40;
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;

  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; 
  letter-spacing: -0.5px;

  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateX(-50%);
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

const PopupContainer = styled.div`
  display: flex;
  width: 272px;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  border-radius: var(--Border-Radius-radius_500, 16px);
  border: 3px solid var(--Color-secondary-soft_blue, #D3EDFF);
  background: linear-gradient(144deg, #FFF -0.87%, #FFF 109.18%);
  z-index: 4;
`;

const PopupTitle = styled.div`
`;

const PopupSub = styled.div`
`;

const CancelButton = styled.div`
`

const MoveButton = styled.div`
`;