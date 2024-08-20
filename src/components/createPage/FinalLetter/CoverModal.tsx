import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import X from "../../../../public/assets/X.png";
import basic from "../../../../public/assets/Book1.png";
import book2 from "../../../../public/assets/Book2.png";
import camera from "../../../../public/assets/camera.png";
import image1 from "../../../../public/assets/layer1.png";
import image2 from "../../../../public/assets/layer2.png";
import image3 from "../../../../public/assets/layer3.png";
import FontSelect from "../CoverDeco/FontSelect";
import ImageCropper from "../CoverDeco/ImageCropper";
import { Area } from "react-easy-crop";

const fonts = [
  { name: "SUIT", family: "SUIT" },
  { name: "노트산스", family: "Eulyoo1945" },
  { name: "언즈체", family: "Ownglyph_UNZ-Rg" },
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
  const images = [image1, image2, image3, image3, image3];
  const books = [basic, book2, book2, book2, book2];
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
          {isKeyboardOpen && (
            <KeyboardBar keyboardHeight={keyboardHeight}>
              <FontSelect font={font} fonts={fonts} setFont={setFont} />
            </KeyboardBar>
          )}
        </TitleContainer>
        {ImageIndex === 0 ? (
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
            <BtnImgContainer
              bgimg={croppedImage}
              onClick={onUploadImageButtonClick}
            >
              <input
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                ref={imgRef}
                onChange={onUploadImage}
              />
            </BtnImgContainer>
          )
        ) : (
          <></>
        )}
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
const ModalContainer = styled.div<{
  keyboardHeight: number;
  isKeyboardOpen: boolean;
}>`
  position: absolute;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: ${({ isKeyboardOpen, keyboardHeight }) =>
    isKeyboardOpen ? `calc(100% + ${keyboardHeight}px)` : "38rem"};
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
  background: "#e9ecef";
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
  padding-top: 4spx;
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
const BtnImgContainer = styled.div<{ bgimg: string }>`
  width: 150px;
  height: 150px;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 100px;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 3.8px;
  margin-left: 4.5px;
`;
const TitleContainer = styled.div`
  display: flex;
  width: 224px;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
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
  border-radius: 4px;
  border: 1px dashed #fff;
  background: rgba(255, 255, 255, 0.2);

  &::placeholder {
    line-height: 24px;
    color: #f1f3f5;
    text-align: center;
    text-overflow: ellipsis;
    font-family: ${(props) => props.font};
    font-size: 16px;
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
      props.font === "Ownglyph_UNZ-Rg" ? "21px" : "16px"};
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    line-height: 24px;
  } //언즈체일때 글씨 크기
  &:focus {
    outline: none;
  }
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
const Image = styled.img<{ clicked: boolean }>`
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${(props) => (props.clicked ? "56px" : "48px")};
  height: ${(props) => (props.clicked ? "56px" : "48px")};
  opacity: ${(props) => (props.clicked ? "" : "0.4")};
  border-radius: 8px;
  border: ${(props) => (props.clicked ? "3px solid #ffa256" : "")};
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
  border-radius: 8px;
  background: #000;
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
