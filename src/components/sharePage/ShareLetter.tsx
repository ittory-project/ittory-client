import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pagination } from '../common/Pagination';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReceiveLetterCover } from '../receivePage/ReceiveLetterCover';
import { ReceiveLetterContents } from '../receivePage/ReceiveLetterContents';
import { decodeLetterId } from '../../api/config/base64';
import { LetterDetailGetResponse } from '../../api/model/LetterModel';
import { getLetterDetailInfo } from '../../api/service/LetterService';
import { FontGetResponse } from '../../api/model/FontModel';
import { CoverTypeGetResponse } from '../../api/model/CoverTypeModel';
import { getFontById } from '../../api/service/FontService';
import { getCoverTypeById } from '../../api/service/CoverTypeService';
import { AppDispatch, clearData, clearOrderData } from '../../api/config/state';
import { useDispatch } from 'react-redux';

declare global {
  interface Window {
    Kakao: any;
  }
}

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const ShareLetter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { letterId } = useParams();
  const [letterNumId] = useState(decodeLetterId(String(letterId)));
  const [letterInfo, setLetterInfo] = useState<LetterDetailGetResponse>();
  const [partiList, setPartiList] = useState<string>('');
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
    const nicknameString = response.elements
      .map((element) => element.nickname)
      .join(", ");
    setPartiList(nicknameString)
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
    dispatch(clearOrderData())
    dispatch(clearData());
    window.localStorage.setItem('nowLetterId', "1")
    window.localStorage.setItem('nowSequence', "1")
    window.localStorage.setItem('nowRepeat', "1")
    window.localStorage.setItem('totalItem', "1")
  }, [])
  useEffect (() => {
    getSharedLetter(letterNumId)
  }, [letterNumId])
  useEffect(() => {
    getSharedLetterStyle()
  }, [letterInfo])

  const renderPageContent = () => {
    if (!letterInfo || !coverType || !font) {
      return <div>편지를 찾을 수 없습니다.</div>
    } else {
      if (currentPage === 1) 
        return  <ReceiveLetterCover letterStyle={coverType} letterFontStyle={font} letterContent={letterInfo} partiList={partiList}/> ;
      else 
        return <ReceiveLetterContents letterFontStyle={font} letterContent={letterInfo.elements[currentPage - 2]}/>;
    }
  };

  const handleStorage = async () => {
    navigate('/LetterBox')
  }

  const { Kakao } = window;
  useEffect (() => {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
  }, [])
  
  const shareKakao = () =>{
    if (letterInfo) {
      console.log(window.Kakao.isInitialized())
      Kakao.API.request({
        url: '/v2/api/talk/memo/default/send',
        data: {
          template_object: {
            object_type: 'feed',
            content: {
              title: `To. ${letterInfo.receiverName}`,
              description: '바스락... 바스락...\n편지함 앞에서 들리는 의문의 소리...',
              image_url:
                `/img/share_thumbnail.png`,
              link: {
                mobile_web_url: `${import.meta.env.VITE_FRONT_URL}/receive/${letterId}?to=${encodeURIComponent(letterInfo.receiverName)}`,
                web_url: `${import.meta.env.VITE_FRONT_URL}/receive/${letterId}?to=${encodeURIComponent(letterInfo.receiverName)}`,
              },
            },
            buttons: [
              {
                title: '편지 확인하기',
                link: {
                  mobile_web_url: `${import.meta.env.VITE_SERVER_URL}/receive/${letterId}?to=${encodeURIComponent(letterInfo.receiverName)}`,
                  web_url: `${import.meta.env.VITE_SERVER_URL}/receive/${letterId}?to=${encodeURIComponent(letterInfo.receiverName)}`,
                },
              },
            ],
          },
        },
      })
      .then((response: string) => {
        console.log(response);
      })
      .catch((error: string) => {
        console.log(error);
      });
    }
  }

  const createShare = async () => {
    try {
      if (letterInfo) {
        await navigator.share({
          title: `To. ${letterInfo.receiverName}`,
          text: '바스락... 바스락...\n편지함 앞에서 들리는 의문의 소리...',
          url: `${import.meta.env.VITE_SERVER_URL}/receive/${letterId}?to=${encodeURIComponent(letterInfo.receiverName)}`,
        });
        console.log('공유 성공');
      } else {
        console.log('공유 실패');
      }
    } catch (e) {
      console.log('공유 실패');
    }
  }

  return (
    (letterInfo && coverType && font) ? (
      <Background $backgroundimg={"" + coverType.outputBackgroundImageUrl}>
        <ToDiv $fonttype={font.name}>To. {letterInfo.receiverName}</ToDiv>
        <CoverContainer $boardimg={"" + coverType.outputBoardImageUrl}>
          {renderPageContent()}
        </CoverContainer>
        <Pagination totalPages={elementLength + 1} />
        <button style={{ fontSize: "10px" }}onClick={createShare}>링크테스트</button>
        <BtnContainer>
          <StoreBtn onClick={handleStorage}>편지함에 보관하기</StoreBtn>
          <ShareBtn onClick={shareKakao}>지금 공유하기</ShareBtn>
        </BtnContainer>
      </Background>
    ) : (
      <div>편지를 불러올 수 없습니다.</div>
    )
  );
};

const Background = styled.div<{ $backgroundimg: string }>`
  width: 100%;
  height: 100vh;
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

const BtnContainer = styled.div`
  display: flex;
  width: 320px;
  padding: 10px 16px 5px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StoreBtn = styled.button`
  display: flex;
  width: 140px;
  height: 48px;
  padding: var(--Typography-size-s, 14px) 20px;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--color-black-white-white, #FFF);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
  color: var(--Color-grayscale-gray700, #495057);

  /* body/small_bold */
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  &:focus {
    outline: none;
  }
`;

const ShareBtn = styled.button`
  display: flex;
  width: 140px;
  height: 48px;
  padding: var(--Typography-size-s, 14px) 20px;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: var(--Color-primary-orange, #FFA256);
  box-shadow: -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset, 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30) inset;
  color: var(--color-black-white-white, #FFF);

  /* body/small_bold */
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  &:focus {
    outline: none;
  }
`;
