import React, { useCallback, useEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import camera from '../../../../public/assets/camera.svg';
import camera_mini from '../../../../public/assets/camera_mini.svg';
import shadow from '../../../../public/assets/shadow2.svg';
import X from '../../../../public/assets/x.svg';
import { CoverType } from '../../../api/model/CoverType';
import { ImageUrlRequest } from '../../../api/model/ImageModel';
import { getCoverTypes } from '../../../api/service/CoverService';
import { getAllFont } from '../../../api/service/FontService';
import { postCoverImage } from '../../../api/service/ImageService';
import { ImageExtension } from '../../../constants';
import { SessionLogger } from '../../../utils/SessionLogger';
import { fontProps } from '../CoverDeco/CoverStyle';
import FontPopup from '../CoverDeco/FontPopup';

const logger = new SessionLogger('create');

interface Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  croppedImage: string;
  backgroundimage: number;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundimage: React.Dispatch<React.SetStateAction<number>>;
  selectfont: string;
  setSelectfont: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectFid: React.Dispatch<React.SetStateAction<number>>;
  selectFid: number;
}

export default function CoverModal({
  title,
  setTitle,
  croppedImage,
  setCroppedImage,
  backgroundimage,
  selectfont,
  setSelectfont,
  setIsModalOpen,
  setKeyboardVisible,
  selectedImageIndex,
  setSelectedImageIndex,
  setSelectFid,
  setBackgroundimage,
  selectFid,
}: Props) {
  const modalBackground = useRef<HTMLDivElement | null>(null);
  const closeModal = () => setIsModalOpen(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const imgRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [originalImage, setOriginalImage] = useState<string>('');
  const [, setCropperKey] = useState<number>(0);
  const [, setBookimage] = useState<number>(backgroundimage - 1);
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [fontPopup, setFontPopup] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>(
    String(backgroundimage),
  );
  const [ImageIndex, setImageIndex] = useState<number>(backgroundimage);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [fonts, setFonts] = useState<fontProps[]>([]);
  const [font, setFont] = useState<string>(selectfont);
  const [selectf, setSelectf] = useState<string>('');
  const [selectfid, setSelectfid] = useState<number>(0);

  useEffect(() => {
    const imageUrl = coverTypes[ImageIndex]?.editImageUrl;
    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  }, [ImageIndex, coverTypes]);

  useEffect(() => {
    const fetchFonts = async () => {
      const types = await getAllFont();
      setFonts(types);
    };
    fetchFonts();
    setSelectfid(selectFid);
  }, []);

  useEffect(() => {
    const fetchCoverTypes = async () => {
      const types = await getCoverTypes();
      setCoverTypes(types);
    };

    fetchCoverTypes();
  }, []);

  useEffect(() => {
    setImageIndex(selectedImageIndex);
  }, [selectedImageIndex, croppedImage]);

  const handleFinalCover = () => {
    localStorage.setItem('title', title);
    localStorage.setItem('image', croppedImage);
    localStorage.setItem('bgImg', String(ImageIndex));
    localStorage.setItem('font', font);
    setSelectedImageIndex(ImageIndex);
    setBackgroundimage(ImageIndex);
    setSelectfont(font);
    setIsModalOpen(false);
    setSelectFid(selectfid);
  };

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        modalBackground.current &&
        !modalBackground.current.contains(e.target as Node)
      ) {
        setKeyboardVisible(false);
        closeModal();
      } else setKeyboardVisible(true);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [modalBackground]);

  const handlePopup = () => {
    setFontPopup(true);
  };

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      let currentHeightDiff = 0;
      if (window.visualViewport) {
        currentHeightDiff = window.innerHeight - window.visualViewport.height;
      } else {
        currentHeightDiff =
          window.innerHeight - document.documentElement.clientHeight;
      }
      if (inputRef.current && inputRef.current.contains(e.target as Node)) {
        if (currentHeightDiff > 0) {
          if (window.innerWidth < 850) {
            setIsKeyboardOpen(true);
            setIsKeyboardOpen(true);
            setKeyboardHeight(currentHeightDiff);
            inputRef.current.focus();
          } else {
            setIsKeyboardOpen(false);
            setKeyboardHeight(0);
            handlePopup();
          }
        } else {
          setIsKeyboardOpen(false);
          setKeyboardHeight(0);
          handlePopup();
        }
      }
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setFontPopup(false); // fontPopup 숨기기
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [inputRef]);

  useEffect(() => {
    const handleSaveClick = async () => {
      {
        if (originalImage !== '') {
          //Blob으로 변경
          const responseBlob = await fetch(originalImage).then((res) =>
            res.blob(),
          );

          // Step 1: URL 발급 요청
          const imageUrlRequest: ImageUrlRequest = {
            imgExtension: ImageExtension.JPG,
          };

          const { preSignedUrl, key } = await postCoverImage(imageUrlRequest);

          // Step 2: presigned URL로 이미지 업로드
          await fetch(preSignedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'image/jpeg', // MIME type 설정
            },
            body: responseBlob, // Blob으로 변환된 이미지 본문에 추가
          });

          // Step 3: 업로드가 완료되면 S3 URL 생성
          const s3ImageUrl = `https://ittory.s3.ap-northeast-2.amazonaws.com/${key}`;
          setCroppedImage(s3ImageUrl);
        }
      }
    };

    handleSaveClick();
  }, [originalImage]);

  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }
      const newImageUrl = URL.createObjectURL(e.target.files[0]);
      setOriginalImage(newImageUrl); // 원본 이미지를 설정
      setCropperKey((prevKey) => prevKey + 1); // Cropper의 key를 변경하여 강제로 리렌더링
    },
    [],
  );

  const onUploadImageButtonClick = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.value = ''; // 파일 입력 필드를 초기화
      imgRef.current.click();
    }
  }, []);

  const handleImageClick = (index: number) => {
    setImageIndex(index);
    setBookimage(index);
  };

  const closeCoverModal = () => {
    setIsModalOpen(false);
  };

  const handlePopupClick = (e: React.MouseEvent) => {
    logger.debug('팝업 클릭 함수 실행');
    // FontPopup을 클릭하면 input에 포커스를 유지
    if (popupRef.current) {
      logger.debug('팝업 클릭함');
      if (inputRef.current) {
        logger.debug('인풋에 포커스');
        inputRef.current.focus();
      }
      // input에 포커스를 유지시켜 키보드를 올려둠
    }
    e.stopPropagation(); // 이벤트 전파를 막아 다른 요소가 클릭되지 않도록 함
  };

  return (
    <ModalContainer
      ref={modalBackground}
      $keyboardHeight={keyboardHeight}
      $isKeyboardOpen={isKeyboardOpen}
    >
      <Header>
        <Title>표지 수정하기</Title>
        <Cancel onClick={closeCoverModal}>
          <img src={X} alt="X Icon" style={{ width: '14px', height: '14px' }} />
        </Cancel>
      </Header>
      <Book $backgroundImage={backgroundImage}>
        <TitleContainer>
          <Input
            ref={inputRef}
            placeholder="제목 최대 12자"
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.length > 12) {
                e.target.value = e.target.value.slice(0, 12);
              }
              setTitle(e.target.value);
            }}
            minLength={1}
            maxLength={12}
            spellCheck="false"
            $font={font}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="184"
            height="2"
            viewBox="0 0 184 2"
            fill="none"
          >
            <path d="M0 1H184" stroke="white" strokeDasharray="6 6" />
          </svg>
        </TitleContainer>
        {croppedImage === '' ? (
          <ButtonContainer
            className="img__box"
            onClick={onUploadImageButtonClick}
          >
            <input
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              ref={imgRef}
              onChange={onUploadImage}
            />
            <img
              src={camera}
              alt="Camera Icon"
              style={{ width: '24px', height: '24px' }}
            />
            <BtnTxt>사진 추가</BtnTxt>
          </ButtonContainer>
        ) : (
          <>
            <Shadow src={shadow} />
            <BtnImgContainer
              $bgimg={croppedImage}
              onClick={onUploadImageButtonClick}
            >
              <CameraIcon>
                <Camera src={camera_mini} alt="camera_icon" />
              </CameraIcon>
              <input
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                ref={imgRef}
                onChange={onUploadImage}
              />
            </BtnImgContainer>
          </>
        )}

        <NameContainer $book={ImageIndex}>
          <NameTxt $book={ImageIndex}>
            자동으로 참여자 이름이 들어갈 거예요
          </NameTxt>
        </NameContainer>
      </Book>
      <ImageContainer>
        {coverTypes.map((coverType, index) => (
          <Image
            onClick={() => handleImageClick(index)}
            $clicked={ImageIndex === index}
            key={index}
            $img={
              ImageIndex === index
                ? coverType.selectImageUrl
                : coverType.notSelectImageUrl
            }
            className="image"
          />
        ))}
      </ImageContainer>
      <Button onClick={handleFinalCover} $isKeyboardOpen={isKeyboardOpen}>
        <ButtonTxt>완료</ButtonTxt>
      </Button>
      {fontPopup && (
        <FontPopup
          font={font}
          fonts={fonts}
          setFont={setFont}
          setFontPopup={setFontPopup}
          fontPopup={fontPopup}
          select={selectf}
          setSelect={setSelectf}
          setSelectfid={setSelectfid}
          selectfid={selectfid}
          ref={popupRef}
          handlePopupClick={handlePopupClick}
        />
      )}
    </ModalContainer>
  );
}

const CameraIcon = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;

  box-sizing: border-box;
  display: flex;

  flex-shrink: 0;

  gap: 8.571px;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  padding: 3.429px;

  background: rgba(0, 0, 0, 0.5);
  border-radius: 13.714px;
`;
const Camera = styled.img`
  flex-shrink: 0;

  width: 16px;
  height: 16px;
`;
const ModalContainer = styled.div<{
  $keyboardHeight: number;
  $isKeyboardOpen: boolean;
}>`
  position: absolute;
  bottom: 1px;
  z-index: 50;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  width: 100%;
  height: ${({ $isKeyboardOpen, $keyboardHeight }) =>
    $isKeyboardOpen ? `calc(33rem - ${$keyboardHeight}px)` : '33rem'};

  padding: 24px 24px 20px 0px;

  background: #fff;
  border-radius: 24px 24px 0px 0px;
  box-shadow: -4px 0px 14px 0px rgba(0, 0, 0, 0.05);
  //align-items: center;
`;
const ButtonContainer = styled.button`
  display: flex;

  flex-shrink: 0;
  flex-direction: column;

  gap: 4px;
  align-items: center;
  justify-content: center;

  width: 150px;
  height: 150px;

  margin-top: 2.5px;
  margin-right: 35px;
  margin-left: 39px;

  cursor: pointer;

  background: #e9ecef;
  border-radius: 100px;
  &:focus {
    outline: none;

    border: none;
  }
`;
const BtnTxt = styled.div`
  padding-top: 4px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px;

  color: #495057;

  letter-spacing: -0.5px;
`;
const Header = styled.div`
  position: relative;

  display: flex;

  gap: 10px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  padding-left: 24px;
`;
const Title = styled.span`
  display: block;

  flex: 1 0 0;

  align-self: flex-start;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #000;

  text-align: left;
  letter-spacing: -0.5px;
`;
const Cancel = styled.span`
  position: absolute;
  right: 4.17px;

  cursor: pointer;
`;
const Book = styled.div<{ $backgroundImage: string }>`
  position: absolute;
  left: 50%;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 224px;
  height: 294px;

  margin-top: 3rem;

  background-image: url(${(props) => props.$backgroundImage});
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
  background-size: cover; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  border-radius: 3.833px 11.5px 11.5px 3.833px;

  transform: translateX(-50%);
`;
const Shadow = styled.img`
  position: absolute;
  z-index: 3;

  flex-shrink: 0;

  width: 158px;
  height: 153px;

  margin-top: 76px;
  margin-left: -3px;

  pointer-events: none;

  object-fit: cover;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  position: relative;
  z-index: 0;

  flex-shrink: 0;

  gap: 4px;

  width: 135.7px;
  height: 135.7px;

  margin-top: 17px;

  cursor: pointer;

  background-image: url(${(props) => props.$bgimg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 20px;
`;
const TitleContainer = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 224px;

  padding: 16px 0px 12px 0px;
`;
const Input = styled.input<{ $font: string }>`
  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 179px;
  height: 40px;

  padding: 0px 16px;

  text-align: center;

  cursor: pointer;

  background: rgba(255, 255, 255, 0);
  border: 0;
  &::placeholder {
    text-overflow: ellipsis;

    font-family: ${(props) => props.$font};
    font-size: ${(props) =>
      props.$font === 'Ownglyph_UNZ-Rg' ? '24px' : '16px'};
    font-style: normal;
    font-weight: 500;

    line-height: 24px;

    color: #f1f3f5;

    text-align: center;
    text-align: center;
    letter-spacing: -0.5px;
  }
  &:valid {
    text-overflow: ellipsis;

    font-family: ${(props) => props.$font};
    font-size: ${(props) =>
      props.$font === 'Ownglyph_UNZ-Rg' ? '24px' : '16px'};
    font-style: normal;
    font-weight: 500;

    line-height: 24px;

    color: #f1f3f5;

    text-align: center;
    letter-spacing: -0.5px;
  }
  &:focus {
    outline: none;
  }
`;
const NameContainer = styled.div<{ $book: number }>`
  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  width: 224px;
  height: 21px;

  margin-top: ${(props) =>
    props.$book === 0 || props.$book === 1 ? '34px' : '25px'};

  text-align: center;
`;
const NameTxt = styled.div<{ $book: number }>`
  width: 200px;

  padding: 0 12px 0 12px;

  text-overflow: ellipsis;

  font-family: SUIT;
  font-size: 9px;
  font-style: normal;
  font-weight: 700;

  line-height: 13px;

  color: ${({ $book }) => {
    if ($book === 0) return '#715142';
    if ($book === 1) return '#335839';
    if ($book === 2) return '#985566';
    if ($book === 3) return '#232D3D';
    if ($book === 4) return '#232D3D';
  }};

  text-align: center;
  letter-spacing: -0.5px;
`;
const ImageContainer = styled.div`
  position: relative;

  display: flex;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  align-self: stretch;
  justify-content: center;

  height: 56px;

  margin-top: 21rem;
`;

const Image = styled.div<{ $clicked: boolean; $img: string }>`
  flex-shrink: 0;

  width: ${(props) => (props.$clicked ? '56px' : '48px')};
  height: ${(props) => (props.$clicked ? '56px' : '48px')};

  cursor: pointer;

  background-image: url(${(props) => props.$img});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 10.2px;

  opacity: ${(props) => (props.$clicked ? '' : '0.4')};

  transition: all 0.2s ease;
`;

const Button = styled.button<{ $isKeyboardOpen: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 50%;

  box-sizing: border-box;
  display: ${(props) =>
    props.$isKeyboardOpen
      ? 'none'
      : 'flex'}; /* 키보드가 올라왔을 때 버튼 숨김 */

  gap: 8px;
  align-items: center;
  align-self: stretch;
  align-self: stretch;
  justify-content: center;

  width: 288px;
  height: 48px;

  padding: var(--Typography-size-s, 14px) 20px;

  background: #343a40;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;

  transform: translateX(-50%);
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #fff;

  letter-spacing: -0.5px;
`;
