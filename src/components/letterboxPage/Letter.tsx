import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import more from '../../../public/assets/more_white.svg';
import ChevronLeft from '../../../public/assets/letterbox/chevron_left.svg?react';
import { Created_Modal } from './Created_Modal';
import { Received_Modal } from './Received_Modal';
import { Delete_letterbox } from './Delete_letterbox';

import { useNavigate, useLocation } from 'react-router-dom';
import { AppDispatch, clearData, clearOrderData } from '../../api/config/state';
import { useDispatch } from 'react-redux';
import { ReceiveLetterContents } from '../receivePage/ReceiveLetterContents';
import { ReceiveLetterCover } from '../receivePage/ReceiveLetterCover';

import { LetterDetailGetResponse } from '../../api/model/LetterModel';
import { getLetterDetailInfo } from '../../api/service/LetterService';
import { FontGetResponse } from '../../api/model/FontModel';
import { CoverTypeGetResponse } from '../../api/model/CoverTypeModel';
import { getFontById } from '../../api/service/FontService';
import { getCoverTypeById } from '../../api/service/CoverTypeService';
import { Pagination } from '../common/Pagination';

interface Props {
  setOpenLetter: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  context: string | null;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  popup: boolean;
  deleteItem: string;
  isModalOpen: boolean;
  letterId: number;
  openLetter: boolean;
  setDeleteAlert: React.Dispatch<React.SetStateAction<string | null>>;
  deleteAlert: string | null;
}

function Query() {
  return new URLSearchParams(useLocation().search);
}

// 기존 커버를 그대로 사용하지 않고, 별도의 그레디언트를 적용
const backgroundGradientMap = {
  BIRTHDAY: 'linear-gradient(270deg, #FFBF44 0%, #E38D5E 100%);',
  LUCKY: 'linear-gradient(270deg, #97E677 0%, #68A772 100%);',
  LOVE: 'linear-gradient(270deg, #F67FCE 0%, #C97D9A 100%);',
  THANKYOU: 'linear-gradient(270deg, #5A8DED 0%, #647EB1 100%);',
  CHRISTMAS: 'linear-gradient(270deg, #F46351 0%, #CC6261 100%);',
};

export const Letter = ({
  setOpenLetter,
  context,
  setPopup,
  popup,
  deleteItem,
  setIsModalOpen,
  isModalOpen,
  letterId,
  openLetter,
  setDeleteAlert,
  deleteAlert,
}: Props) => {
  const [deleteName, setDeleteName] = useState<string>('');
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const [letterInfo, setLetterInfo] = useState<LetterDetailGetResponse>();
  const [, setPartiList] = useState<string>('');
  const [font, setFont] = useState<FontGetResponse>();
  const [coverType, setCoverType] = useState<CoverTypeGetResponse | null>(null);
  const [elementLength, setElementLength] = useState<number>(0);

  const handleCancel = () => {
    setOpenLetter(false);
    window.history.replaceState({}, '', '/letterbox');
    navigate('/letterbox', { replace: true });
  };
  const handleMore = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    // URL을 쿼리 없는 상태로 덮어쓰기
    navigate('/letterbox', { replace: true });
  }, []);

  useEffect(() => {
    setDeleteName(deleteItem);
  }, [deleteItem]);

  const query = Query();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(query.get('page')) || 1;
    setCurrentPage(page);
  }, [query]);

  useEffect(() => {
    dispatch(clearOrderData());
    dispatch(clearData());
    window.localStorage.setItem('nowLetterId', '1');
    window.localStorage.setItem('nowSequence', '1');
    window.localStorage.setItem('nowRepeat', '1');
    window.localStorage.setItem('totalItem', '1');
    window.localStorage.setItem('resetTime', '');

    const fetchData = async () => {
      try {
        // Letter 상세 정보 가져오기
        const response = await getLetterDetailInfo(Number(letterId));
        setLetterInfo(response);

        // 참여자 목록 문자열화
        const nicknameString = response.elements
          .map((element) => element.nickname)
          .join(', ');
        setPartiList(nicknameString);
        setElementLength(response.elements.length);

        // 스타일 정보 가져오기
        const fontResponse = await getFontById(response.fontId);
        if (fontResponse) setFont(fontResponse);

        const coverTypeResponse = await getCoverTypeById(response.coverTypeId);
        if (coverTypeResponse) setCoverType(coverTypeResponse);
        console.log(coverTypeResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [letterId]);

  const renderPageContent = () => {
    if (!coverType || !font || !letterInfo || !letterId) {
      console.log(coverType, font, letterInfo);
      return <div>편지를 찾을 수 없습니다.</div>;
    } else {
      if (currentPage === 1)
        return (
          <ReceiveLetterCover
            letterStyle={coverType}
            letterFontStyle={font}
            letterContent={letterInfo}
            //partiList={partiList}
          />
        );
      else
        return (
          <ReceiveLetterContents
            letterFontStyle={font}
            letterContent={letterInfo.elements[currentPage - 2]}
          />
        );
    }
  };

  console.log(coverType);

  return (
    coverType && (
      <Background $backgroundimg={'' + coverType.outputBackgroundImageUrl}>
        {isModalOpen && <Overlay />}
        {popup && <Overlay />}
        {letterInfo && font && (
          <>
            <Header>
              <CancelBox>
                <StyledChevronLeft // 수정
                  onClick={handleCancel}
                />
              </CancelBox>
              <MoreBox>
                <More src={more} alt="more_icon" onClick={handleMore} />
              </MoreBox>
            </Header>

            <ToDiv $fonttype={font.name}>To. {letterInfo.receiverName}</ToDiv>
            <CoverContainer
              $coverType={coverType.name as keyof typeof backgroundGradientMap}
            >
              {renderPageContent()}
            </CoverContainer>
            <Pagination totalPages={elementLength + 1} />

            {isModalOpen &&
              (context === 'created' ? (
                <Created_Modal
                  setIsModalOpen={setIsModalOpen}
                  setPopup={setPopup}
                  openLetter={openLetter}
                  letterId={letterId}
                />
              ) : context === 'received' ? (
                <Received_Modal
                  setIsModalOpen={setIsModalOpen}
                  setPopup={setPopup}
                />
              ) : null)}
          </>
        )}
        {popup && (
          <Delete_letterbox
            setOpenLetter={setOpenLetter}
            setPopup={setPopup}
            setIsModalOpen={setIsModalOpen}
            context="created"
            deleteItem={deleteName}
            letterId={letterId}
            setDeleteAlert={setDeleteAlert}
            deleteAlert={deleteAlert}
          />
        )}
      </Background>
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
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 99;
`;
const Header = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0px 4px;
  align-items: center;

  /* NOTE: box-sizing: content-box이면 width 100% + padding 크기가 되어버림 */
  box-sizing: border-box;
`;
const CancelBox = styled.div`
  display: flex;
  padding: 12px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const StyledChevronLeft = styled(ChevronLeft)`
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: white;
`;
const MoreBox = styled.div`
  display: flex;
  padding: 12px;
  position: absolute;
  right: 4px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
const More = styled.img`
  display: flex;
  width: 3px;
  height: 17px;
  flex-shrink: 0;
  margin-right: 10.5px;
  margin-top: 4px;
  cursor: pointer;
`;

const CoverContainer = styled.div<{
  $coverType: keyof typeof backgroundGradientMap;
}>`
  position: relative;
  width: 272px;
  height: 355px;
  flex-shrink: 0;
  border-radius: 0 15px 15px 0;
  background: ${(props) => backgroundGradientMap[props.$coverType]};
  background-size: cover;
  box-shadow:
    0 2px 1px rgba(28, 21, 21, 0.09),
    0 4px 2px rgba(0, 0, 0, 0.09),
    0 8px 4px rgba(0, 0, 0, 0.09),
    0 16px 8px rgba(0, 0, 0, 0.09),
    0 32px 16px rgba(0, 0, 0, 0.09);
`;

const ToDiv = styled.div<{ $fonttype: string }>`
  font-size: 24px;
  margin-bottom: 30px;
  padding: 0px 6px 10px;
  color: var(--color-black-white-white, #fff);
  text-align: center;

  /* title/base_bold */
  font-family: ${(props) => props.$fonttype};
  font-size: var(--Typography-size-base, 16px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-s, 24px); /* 150% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  border-bottom: 2px dashed rgba(255, 255, 255, 0.5);
`;
