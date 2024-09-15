import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import X from "../../../../public/assets/x.svg";
import basic from "../../../../public/assets/Book1.svg";
import book2 from "../../../../public/assets/Book2.svg";
import book3 from "../../../../public/assets/Book3.svg";
import book4 from "../../../../public/assets/Book4.svg";
import book5 from "../../../../public/assets/Book5.svg";
import camera from "../../../../public/assets/camera.svg";
import image1 from "../../../../public/assets/layer1.svg";
import image2 from "../../../../public/assets/layer2.svg";
import image3 from "../../../../public/assets/layer3.svg";
import image4 from "../../../../public/assets/layer4.svg";
import image5 from "../../../../public/assets/layer5.svg";
import FontSelect from "../CoverDeco/FontSelect";
import ImageCropper from "../CoverDeco/ImageCropper";
import { Area } from "react-easy-crop";
import shadow from "../../../../public/assets/shadow2.svg";
import bright from "../../../../public/assets/border.svg";
import camera_mini from "../../../../public/assets/camera_mini.svg";

const fonts = [
  { name: "서체1", family: "GmarketSans" },
  { name: "서체2", family: "Ownglyph_UNZ-Rg" },
  { name: "서체3", family: "CookieRun-Regular" },
  { name: "서체4", family: "Cafe24ClassicType-Regular" },
];

interface Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  croppedImage: string;
  backgroundImage: string;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
  selectfont: string;
  setSelectfont: React.Dispatch<React.SetStateAction<string>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function CoverModal({
  title,
  setTitle,
  croppedImage,
  setCroppedImage,
  backgroundImage,
  setBackgroundImage,
  selectfont,
  setSelectfont,
  setIsModalOpen,
  setKeyboardVisible,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) {
  const modalBackground = useRef<HTMLDivElement | null>(null);
  const closeModal = () => setIsModalOpen(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [font, setFont] = useState<string>(selectfont);
  const images = [image1, image2, image3, image4, image5];
  const books = [basic, book2, book3, book4, book5];
  const imgRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropperKey, setCropperKey] = useState<number>(0);
  const [bookimage, setBookimage] = useState<string>(backgroundImage);
  const [ImageIndex, setImageIndex] = useState<number>(selectedImageIndex);
  const [cropOpen, setCropOpen] = useState(false);

  useEffect(() => {
    console.log(selectedImageIndex);
    setImageIndex(selectedImageIndex);
  }, [selectedImageIndex, croppedImage]);

  useEffect(() => {
    setSelectedImageIndex(ImageIndex);
  }, [ImageIndex]);

  const handleFinalCover = () => {
    setSelectedImageIndex(ImageIndex);
    setBackgroundImage(bookimage);
    setSelectfont(font);
    setIsModalOpen(false);
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
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [modalBackground]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const heightDiff =
        window.innerHeight - document.documentElement.clientHeight;
      if (inputRef.current && inputRef.current.contains(e.target as Node)) {
        setIsKeyboardOpen(true);
        setKeyboardHeight(heightDiff);
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [inputRef]);

  useEffect(() => {
    const handleResize = () => {
      const heightDiff =
        window.innerHeight - document.documentElement.clientHeight;
      if (heightDiff > 100) {
        setIsKeyboardOpen(true);
        setKeyboardHeight(heightDiff);
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //const reader = new FileReader();
      if (!e.target.files) {
        return;
      }
      const newImageUrl = URL.createObjectURL(e.target.files[0]);
      console.log("New Image URL: ", newImageUrl);
      setOriginalImage(newImageUrl); // 원본 이미지를 설정
      setCroppedAreaPixels(null);
      setCropperKey((prevKey) => prevKey + 1); // Cropper의 key를 변경하여 강제로 리렌더링
      openModal();
    },
    []
  );

  const onUploadImageButtonClick = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.value = "";
      imgRef.current.click();
    }
  }, []);

  const handleSaveCroppedImage = (croppedImgUrl: string) => {
    setCroppedImage(croppedImgUrl); // 크롭된 이미지 저장
    setCropOpen(false);
  };

  const handleImageClick = (index: number) => {
    setImageIndex(index);
    setBookimage(books[index]);
  };

  const openModal = () => {
    setCropOpen(true);
  };

  const closeCoverModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalContainer
      ref={modalBackground}
      keyboardHeight={keyboardHeight}
      isKeyboardOpen={isKeyboardOpen}
    >
      <Header>
        <Title>표지 수정하기</Title>
        <Cancel onClick={closeCoverModal}>
          <img src={X} alt="X Icon" style={{ width: "12px", height: "12px" }} />
        </Cancel>
      </Header>

      <Book backgroundImage={bookimage}>
        <TitleContainer ref={inputRef}>
          <Input
            placeholder="제목 최대 12자"
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.value.length > 12) {
                e.target.value = e.target.value.slice(0, 12);
              }
              setTitle(e.target.value);
            }}
            minLength="1"
            maxLength="12"
            spellCheck="false"
            font={font}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="184"
            height="2"
            viewBox="0 0 184 2"
            fill="none"
          >
            <path d="M0 1H184" stroke="white" stroke-dasharray="6 6" />
          </svg>
          {isKeyboardOpen && (
            <KeyboardBar keyboardHeight={keyboardHeight}>
              <FontSelect font={font} fonts={fonts} setFont={setFont} />
            </KeyboardBar>
          )}
        </TitleContainer>
        {ImageIndex !== 4 ? (
          croppedImage === "" ? (
            <ButtonContainer
              className="img__box"
              onClick={onUploadImageButtonClick}
            >
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                ref={imgRef}
                onChange={onUploadImage}
              />
              <img
                src={camera}
                alt="Camera Icon"
                style={{ width: "24px", height: "24px" }}
              />
              <BtnTxt>사진 추가</BtnTxt>
            </ButtonContainer>
          ) : (
            <>
              <Bright src={bright} />
              <Shadow src={shadow} />
              <BtnImgContainer
                bgimg={croppedImage}
                onClick={onUploadImageButtonClick}
              >
                <CameraIcon>
                  <Camera src={camera_mini} alt="camera_icon" />
                </CameraIcon>
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  ref={imgRef}
                  onChange={onUploadImage}
                />
              </BtnImgContainer>
            </>
          )
        ) : (
          <></>
        )}
        <NameBar>
          <NameContainer>
            <NameTxt>자동으로 참여자 이름이 들어갈 거예요</NameTxt>
          </NameContainer>
        </NameBar>
      </Book>
      <ImageContainer>
        {images.map((img, index) => (
          <Image
            onClick={() => handleImageClick(index)}
            clicked={ImageIndex === index}
            key={index}
            src={img}
            alt={`Image ${index + 1}`}
            className="image"
            img={img}
          />
        ))}
      </ImageContainer>
      <Button onClick={handleFinalCover} isKeyboardOpen={isKeyboardOpen}>
        <ButtonTxt>완료</ButtonTxt>
      </Button>
      {cropOpen && (
        <ImageCropper
          key={cropperKey}
          setIsModalOpen={setCropOpen}
          originalImage={originalImage}
          croppedAreaPixels={croppedAreaPixels}
          setCroppedImage={handleSaveCroppedImage} // 크롭된 이미지를 저장하는 함수
          setCroppedAreaPixels={setCroppedAreaPixels}
        />
      )}
    </ModalContainer>
  );
}

const CameraIcon = styled.div`
  display: flex;
  position: absolute;
  right: 8px;
  top: 8px;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  padding: 3.429px;
  justify-content: center;
  align-items: center;
  gap: 8.571px;
  flex-shrink: 0;
  border-radius: 13.714px;
  background: rgba(0, 0, 0, 0.5);
`;
const Camera = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;
const ModalContainer = styled.div<{
  keyboardHeight: number;
  isKeyboardOpen: boolean;
}>`
  position: absolute;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: ${({ isKeyboardOpen, keyboardHeight }) =>
    isKeyboardOpen ? `calc(38rem - ${keyboardHeight}px)` : "38rem"};
  padding: 24px 24px 20px 24px;
  bottom: 1px;
  border-radius: 24px 24px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
  box-shadow: -4px 0px 14px 0px rgba(0, 0, 0, 0.05);
`;
const ButtonContainer = styled.button`
cursor:pointer;
  display: flex;
  width: 150px;
  height: 150px;
  margin-left: 39px;
  margin-right: 35px;
  margin-top:2.5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px
  flex-shrink: 0;
  border-radius: 100px;
  background: #e9ecef;
  &:focus {
  border: none;
    outline: none;
  }
`;
const BtnTxt = styled.div`
  color: #495057;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
  padding-top: 4px;
`;
const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  position: relative;
`;
const Title = styled.span`
  flex: 1 0 0;
  display: block;
  color: #000;
  text-align: left;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  align-self: flex-start;
`;
const Cancel = styled.span`
  position: absolute;
  cursor: pointer;
  right: 4.17px;
`;
const Book = styled.div<{ backgroundImage: string }>`
  width: 224px;
  height: 294px;
  position: fixed;
  margin-top: 3rem;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.backgroundImage});
  display: flex;
  align-items: center;
  flex-direction: column;
  background-size: cover; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
`;
const Bright = styled.img`
  width: 142px;
  height: 142px;
  margin-left: 3px;
  margin-top: 85px;
  position: absolute;
  z-index: 3;
  flex-shrink: 0;
  object-fit: cover;
  pointer-events: none;
`;
const Shadow = styled.img`
  width: 153px;
  height: 153px;
  margin-left: 1px;
  margin-top: 79px;
  position: absolute;
  z-index: 3;
  pointer-events: none;
  flex-shrink: 0;
  object-fit: cover;
`;
const BtnImgContainer = styled.div<{ bgimg: string }>`
  width: 134px;
  z-index: 2;
  cursor: pointer;
  position: relative;
  height: 134px;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 20px;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 19px;
  margin-left: 4px;
`;
const TitleContainer = styled.div`
  display: flex;
  width: 224px;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Input = styled.input<{ font: string }>`
  box-sizing: border-box;
  display: flex;
  width: 179px;
  padding: 0px 16px;
  justify-content: center;
  align-items: center;
  height: 40px;
  text-align: center;
  border: 0;
  background: rgba(255, 255, 255, 0);

  &::placeholder {
    line-height: 24px;
    color: #f1f3f5;
    text-align: center;
    text-overflow: ellipsis;
    font-family: ${(props) => props.font};
    font-size: ${(props) =>
      props.selectfont === "Ownglyph_UNZ-Rg" ? "24px" : "16px"};
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    position: absolute; /* Absolute positioning */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* 중앙 정렬 */
    text-align: center;
  }
  &:valid {
    color: #f1f3f5;
    text-align: center;
    text-overflow: ellipsis;
    font-family: ${(props) => props.font};
    font-size: ${(props) =>
      props.font === "Ownglyph_UNZ-Rg" ? "24px" : "16px"};
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    line-height: 24px;
  }
  &:focus {
    outline: none;
  }
`;
const NameBar = styled.div`
  margin-top: 30px;
  width: 224px;
  height: 23px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-right: none;
  border-left: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NameContainer = styled.div`
  width: 224px;
  height: 21px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0.823px 0.823px 0.823px 0px rgba(255, 255, 255, 0.25) inset;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
`;
const NameTxt = styled.div`
  padding: 0 12px 0 12px;
  width: 200px;
  color: #715142;
  text-align: center;
  text-overflow: ellipsis;
  font-family: SUIT;
  font-size: 9px;
  font-style: normal;
  font-weight: 700;
  line-height: 13px;
  letter-spacing: -0.5px;
`;
const KeyboardBar = styled.div<{ keyboardHeight: number }>`
  position: fixed;
  bottom: ${(props) => props.keyboardHeight}px;
  left: 0;
  right: 0;
  width: 100%;
  height: 56px;
  flex-shrink: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) -61.61%,
    #fff 18.75%
  );
  box-shadow: 0px -4px 14px 0px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ImageContainer = styled.div`
  position: relative;
  margin-top: 24.2rem;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  align-self: stretch;
`;

const Image = styled.div<{ clicked: boolean; img: string }>`
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${(props) => (props.clicked ? "56px" : "48px")};
  height: ${(props) => (props.clicked ? "56px" : "48px")};
  opacity: ${(props) => (props.clicked ? "" : "0.4")};
  border-radius: 10.2px;
  flex-shrink: 0;
  border: ${(props) => (props.clicked ? "3px solid #ffd0a9" : "")};
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Button = styled.button<{ isKeyboardOpen: boolean }>`
  box-sizing: border-box;
  display: ${(props) =>
    props.isKeyboardOpen
      ? "none"
      : "flex"}; /* 키보드가 올라왔을 때 버튼 숨김 */
  width: calc(100% - 48px);
  height: 48px;
  padding: var(--Typography-size-s, 14px) 20px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  justify-content: center;
  align-self: stretch;
  border-radius: 50px;
  background: #343a40;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`;
const ButtonTxt = styled.div`
  color: #fff;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
