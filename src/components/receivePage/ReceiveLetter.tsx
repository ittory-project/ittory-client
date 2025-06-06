import { useEffect, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';
import styled from 'styled-components';

import { accessTokenRepository } from '../../api/config/AccessTokenRepository';
import { coverQuery, fontQuery, letterQuery } from '../../api/queries';
import {
  getLetterStorageCheck,
  postLetterStore,
} from '../../api/service/LetterService';
import { SessionStore } from '../../utils';
import { Pagination } from '../common/Pagination';
import { ReceiveLetterContents } from './ReceiveLetterContents';
import { ReceiveLetterCover } from './ReceiveLetterCover';
import { ReceiveLetterSave } from './ReceiveLetterSave';

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const ReceiveLetter = () => {
  const { letterId } = useParams();
  const letterNumId = Number(letterId);

  const { data: letterInfo } = useSuspenseQuery(
    letterQuery.detailById(letterNumId),
  );
  const { data: font } = useSuspenseQuery(fontQuery.byId(letterInfo.fontId));
  const { data: coverTypes } = useSuspenseQuery(coverQuery.all());
  const coverType = coverTypes.find(
    (type) => type.id === letterInfo.coverTypeId,
  );
  if (!coverType) {
    throw new Error('커버 타입을 찾을 수 없습니다.');
  }

  const navigate = useNavigate();
  const location = useLocation();

  const query = Query();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(query.get('page')) || 1;
    setCurrentPage(page);
  }, [query]);

  type AlertState = 'LOADING' | 'SAVED' | 'ISSTORED';
  const [saveAlert, setSaveAlert] = useState<AlertState>('LOADING');

  const handleSaveLetter = async () => {
    if (!accessTokenRepository.isLoggedIn()) {
      SessionStore.setLoginRedirectUrl(location.pathname + location.search);
      navigate('/login');
      return;
    }

    const storeAvailableResponse = await getLetterStorageCheck(letterNumId);
    if (!storeAvailableResponse.isStored) {
      setSaveAlert('SAVED');
    } else {
      setSaveAlert('ISSTORED');
    }
  };

  const handleSaveBtn = async () => {
    const storeResponse = await postLetterStore(letterNumId);
    if (storeResponse) {
      window.alert(storeResponse);
    }
    setSaveAlert('LOADING');
    navigate('/LetterBox', {
      state: {
        focusCreate: false,
        focusReceive: true,
      },
    });
  };

  const handleCancelBtn = async () => {
    setSaveAlert('LOADING');
  };

  const renderPageContent = () => {
    if (!letterInfo || !coverType || !font) {
      return <div>편지를 찾을 수 없습니다.</div>;
    } else {
      if (currentPage === 1)
        return (
          <ReceiveLetterCover
            letterStyle={coverType}
            letterFontStyle={font}
            letterContent={letterInfo}
          />
        );
      else if (currentPage === letterInfo.elements.length + 2)
        return <ReceiveLetterSave handleSaveLetter={handleSaveLetter} />;
      else
        return (
          <ReceiveLetterContents
            letterContent={letterInfo.elements[currentPage - 2]}
          />
        );
    }
  };

  return letterInfo && coverType && font && letterInfo.elements.length > 0 ? (
    <Background $backgroundimg={'' + coverType.outputBackgroundImageUrl}>
      <ToDiv $fonttype={font.name}>To. {letterInfo.receiverName}</ToDiv>
      <CoverShadow>
        <CoverContainer $boardimg={'' + coverType.outputBoardImageUrl}>
          {renderPageContent()}
        </CoverContainer>
      </CoverShadow>
      <Pagination totalPages={letterInfo.elements.length + 2} />
      {saveAlert === 'SAVED' && (
        <ModalOverlay>
          <PopupContainer>
            <PopupTitle>
              {`${letterInfo.receiverName} 님만`}
              <br />
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
              <MoveButton onClick={handleSaveBtn}>{`보관하기`}</MoveButton>
            </ButtonContainer>
          </PopupContainer>
        </ModalOverlay>
      )}
      {saveAlert === 'ISSTORED' && (
        <ModalOverlay>
          <PopupContainer>
            <PopupTitle>
              {`${letterInfo.receiverName}님이`}
              <br />
              {`이미 보관했어요`}
            </PopupTitle>
            <ButtonContainer>
              <IsStoredButton onClick={handleCancelBtn}>
                {`확인`}
              </IsStoredButton>
            </ButtonContainer>
          </PopupContainer>
        </ModalOverlay>
      )}
    </Background>
  ) : (
    <div>편지를 불러올 수 없습니다.</div>
  );
};

const Background = styled.div<{ $backgroundimg: string }>`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background-image: url(${(props) => props.$backgroundimg});
  background-size: cover;
`;

const CoverContainer = styled.div<{ $boardimg: string }>`
  position: relative;

  flex-shrink: 0;

  width: 272px;
  height: 355px;

  background-image: url(${(props) => props.$boardimg});
  border-radius: 5px 15px 15px 5px;
`;

const CoverShadow = styled.div`
  display: flex;

  align-items: center;

  background-size: cover;
  border-radius: 5px 15px 15px 5px;
  box-shadow:
    0 2px 1px rgba(0, 0, 0, 0.09),
    0 4px 2px rgba(0, 0, 0, 0.09),
    0 8px 4px rgba(0, 0, 0, 0.09),
    0 16px 8px rgba(0, 0, 0, 0.09),
    0 32px 16px rgba(0, 0, 0, 0.09);
`;

const ToDiv = styled.div<{ $fonttype: string }>`
  padding: 0px 10px;
  margin-bottom: 40px;

  /* title/base_bold */
  font-family: ${(props) => props.$fonttype};
  font-size: 24px;
  font-size: var(--Typography-size-base, 16px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-s, 24px); /* 150% */

  color: var(--color-black-white-white, #fff);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  border-bottom: 2px dashed rgba(255, 255, 255, 0.5);
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.3);
`;

const PopupContainer = styled.div`
  z-index: 4;

  display: flex;

  flex-direction: column;

  gap: 8px;
  align-items: center;

  width: 272px;

  padding: 20px;
  margin: auto 24px;

  background: linear-gradient(144deg, #fff -0.87%, #fff 109.18%);
  border: 3px solid var(--Color-secondary-soft_blue, #d3edff);
  border-radius: var(--Border-Radius-radius_500, 16px);
`;

const PopupTitle = styled.div`
  /* title/base_bold */
  font-family: var(--Typography-family-title, SUIT);
  font-size: var(--Typography-size-base, 16px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-s, 24px); /* 150% */

  color: var(--Color-grayscale-gray900, #212529);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupSub = styled.div`
  margin: 0 0 12px 0;
  /* caption/xsmall */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 400;

  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */

  color: var(--Color-grayscale-gray600, #868e96);

  text-align: center;
  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const ButtonContainer = styled.div`
  display: flex;

  gap: 8px;
  justify-content: center;
`;

const CancelButton = styled.div`
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 58px;
  height: 40px;

  padding: 2px 25px;
  margin: 0 1rem 0 0;

  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--Color-grayscale-gray700, #495057);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--Color-grayscale-gray300, #dee2e6);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;

const MoveButton = styled.div`
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 58px;
  height: 40px;

  padding: 2px 25px;

  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--color-black-white-white, #fff);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--Color-primary-orange, #ffa256);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;

const IsStoredButton = styled.div`
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 200px;
  height: 40px;

  padding: 2px 25px;
  margin: 12px 0 0 0;

  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--color-black-white-white, #fff);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--Color-grayscale-gray800, #343a40);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
