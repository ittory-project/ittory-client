import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Pagination } from '../common/Pagination';
import { decodeLetterId } from '../../api/config/base64';
import { ReceiveLetterCover } from './ReceiveLetterCover';
import { ReceiveLetterSave } from './ReceiveLetterSave';
import { ReceiveLetterContents } from './ReceiveLetterContents';
import { LetterDetailGetResponse } from '../../api/model/LetterModel';
import { FontGetResponse } from '../../api/model/FontModel';
import { CoverTypeGetResponse } from '../../api/model/CoverTypeModel';
import { getLetterDetailInfo, getLetterStorageCheck, postLetterStore } from '../../api/service/LetterService';
import { getFontById } from '../../api/service/FontService';
import { getCoverTypeById } from '../../api/service/CoverTypeService';

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const ReceiveLetter = () => {
  const { letterId } = useParams();
  const navigate = useNavigate();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const [letterInfo, setLetterInfo] = useState<LetterDetailGetResponse>();
  const [font, setFont] = useState<FontGetResponse>();
  const [coverType, setCoverType] = useState<CoverTypeGetResponse>()
  const [elementLength, setElementLength] = useState<number>(0);

  const query = Query();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(query.get("page")) || 1;
    setCurrentPage(page);
  }, [query]);

  const getSharedLetter = async (letterNumId: number) => {
    const response = await getLetterDetailInfo(letterNumId)
    setLetterInfo(response)
    setElementLength(response.elements.length)
  }

  const getSharedLetterStyle = async () => {
    if (letterInfo) {
      const fontResponse = await getFontById(letterInfo.fontId)
      if (fontResponse) {
        setFont(fontResponse)
      }
      const coverTypeResponse = await getCoverTypeById(letterInfo.coverTypeId)
      if (coverTypeResponse) {
        setCoverType(coverTypeResponse)
      }
    }
  }

  useEffect (() => {
    getSharedLetter(letterNumId)
  }, [letterNumId])
  useEffect(() => {
    getSharedLetterStyle()
  }, [letterInfo])

  type AlertState = 'LOADING' | 'SAVED' | 'ISSTORED';
  const [saveAlert, setSaveAlert] = useState<AlertState>('LOADING');

  const handleSaveLetter = async () => {
    const storeAvailableResponse = await getLetterStorageCheck(letterNumId)
    if (!storeAvailableResponse.isStored) {
      setSaveAlert('SAVED')
    } else {
      setSaveAlert('ISSTORED')
    }
  }

  const handleSaveBtn = async () => {
    const storeResponse = await postLetterStore(letterNumId);
    if (storeResponse) {
      window.alert(storeResponse)
    }
    setSaveAlert('LOADING')
    navigate("/LetterBox", {
      state: {
        focusCreate: false,
        focusReceive: true,
      },
    }); 
  }

  const handleCancelBtn = async () => {
    setSaveAlert('LOADING')
  }

  const renderPageContent = () => {
    if (!letterInfo || !coverType || !font) {
      return <div>편지를 찾을 수 없습니다.</div>
    } else {
      if (currentPage === 1) 
        return  <ReceiveLetterCover letterStyle={coverType} letterFontStyle={font} letterContent={letterInfo}/> ;
      else if (currentPage === elementLength + 2) 
        return <ReceiveLetterSave handleSaveLetter={handleSaveLetter}/> ;
      else 
        return <ReceiveLetterContents letterFontStyle={font} letterContent={letterInfo.elements[currentPage - 2]}/>;
    }
  };

  return (
    (letterInfo && coverType && font && elementLength > 0) ? (
      <Background $backgroundimg={"" + coverType.outputBackgroundImageUrl}>
        <ToDiv $fonttype={font.name}>To. {letterInfo.receiverName}</ToDiv>
        <CoverShadow>
          <CoverContainer $boardimg={"" + coverType.outputBoardImageUrl}>
            {renderPageContent()}
          </CoverContainer>
        </CoverShadow>
        <Pagination totalPages={elementLength + 2} />
        {saveAlert === 'SAVED' &&
          <ModalOverlay>
            <PopupContainer>
              <PopupTitle>
                {`${letterInfo.receiverName} 님만`}<br />
                {`보관할 수 있어요`}
              </PopupTitle>
              <PopupSub>
                {`받는 사람 이름을 확인해 주세요.`} <br />
                {`편지함에 보관하시겠어요?`}
              </PopupSub>
              <ButtonContainer>
                <CancelButton onClick={handleCancelBtn}>
                  {`취소하기`}
                </CancelButton>
                <MoveButton onClick={handleSaveBtn}>
                  {`보관하기`}
                </MoveButton>
              </ButtonContainer>
            </PopupContainer>
          </ModalOverlay>
        }
        {saveAlert === 'ISSTORED' &&
          <ModalOverlay>
          <PopupContainer>
            <PopupTitle>
            {`${letterInfo.receiverName}님이`}<br />
            {`이미 보관했어요`}
            </PopupTitle>
            <ButtonContainer>
              <IsStoredButton onClick={handleCancelBtn}>
                {`확인`}
              </IsStoredButton>
            </ButtonContainer>
          </PopupContainer>
        </ModalOverlay>
        }
      </Background>
    ) : (
      <div>편지를 불러올 수 없습니다.</div>
    )
  );
};

const Background = styled.div<{ $backgroundimg: string }>`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-image: url(${(props) => props.$backgroundimg});
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CoverContainer = styled.div<{ $boardimg: string }>`
  position: relative;
  width: 272px;
  height: 355px;
  flex-shrink: 0;
  border-radius: 5px 15px 15px 5px;
  background-image: url(${(props) => props.$boardimg})
`;

const CoverShadow = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px 15px 15px 5px;
  background-size: cover;
  box-shadow: 0 2px 1px rgba(0,0,0,0.09), 
              0 4px 2px rgba(0,0,0,0.09), 
              0 8px 4px rgba(0,0,0,0.09), 
              0 16px 8px rgba(0,0,0,0.09),
              0 32px 16px rgba(0,0,0,0.09);
`;

const ToDiv = styled.div<{ $fonttype: string }>`
  font-size: 24px;
  margin-bottom: 40px;
  padding: 0px 10px;
  color: var(--color-black-white-white, #FFF);
  text-align: center;

  /* title/base_bold */
  font-family: ${(props) => props.$fonttype};
  font-size: var(--Typography-size-base, 16px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-s, 24px); /* 150% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  border-bottom: 2px dashed rgba(255, 255, 255, 0.50);
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
  background-color: rgba(0, 0, 0, 0.80);
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
  color: var(--Color-grayscale-gray900, #212529);
  text-align: center;

  /* title/base_bold */
  font-family: var(--Typography-family-title, SUIT);
  font-size: var(--Typography-size-base, 16px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-s, 24px); /* 150% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupSub = styled.div`
  text-align: center;
  color: var(--Color-grayscale-gray600, #868E96);
  text-align: center;
  margin: 0 0 1rem 0;
  /* caption/xsmall */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CancelButton = styled.div`
  color: var(--Color-grayscale-gray700, #495057);
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  display: flex;
  margin: 0 1rem 0 0;
  height: 40px;
  padding: 2px 25px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-grayscale-gray300, #DEE2E6);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
`

const MoveButton = styled.div`
  color: var(--color-black-white-white, #FFF);
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  display: flex;
  height: 40px;
  padding: 2px 25px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-primary-orange, #FFA256);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
`;

const IsStoredButton = styled.div`
  color: var(--color-black-white-white, #FFF);
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  display: flex;
  height: 40px;
  width: 200px;
  margin: 1rem 0 0 0;
  padding: 2px 25px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-grayscale-gray800, #343A40);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
`;