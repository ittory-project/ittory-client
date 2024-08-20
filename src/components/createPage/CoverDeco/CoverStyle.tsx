import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PrevImg from "../../../../public/assets/pageprev.png";
import basic from "../../../../public/assets/Book1.png";
import book2 from "../../../../public/assets/Book2.png";
import camera from "../../../../public/assets/camera.png";
import image1 from "../../../../public/assets/layer1.png";
import image2 from "../../../../public/assets/layer2.png";
import image3 from "../../../../public/assets/layer3.png";
import FontSelect from "./FontSelect";
import ImageCropper from "./ImageCropper";
import { Area } from "react-easy-crop";

const fonts = [
  { name: "SUIT", family: "SUIT" },
  { name: "노트산스", family: "Eulyoo1945" },
  { name: "언즈체", family: "Ownglyph_UNZ-Rg" },
];

interface Props {
  setViewCoverDeco: React.Dispatch<React.SetStateAction<boolean>>;
  setViewStartpage: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  croppedImage: string;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
  setSelectfont: React.Dispatch<React.SetStateAction<string>>;
  setViewFinalInfo: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function CoverStyle({
  setViewCoverDeco,
  setViewStartpage,
  title,
  setTitle,
  croppedImage,
  setCroppedImage,
  setBackgroundImage,
  setSelectfont,
  setViewFinalInfo,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [font, setFont] = useState<string>(fonts[0].family);
  const images = [image1, image2, image3, image3, image3];
  const books = [basic, book2, book2, book2, book2];
  const imgRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropperKey, setCropperKey] = useState<number>(0);
  const [ImageIndex, setImageIndex] = useState<number>(0);

  const handleImageClick = (index: number) => {
    setImageIndex(index);
  };

  useEffect(() => {
    console.log("Updated selectedImageIndex:", selectedImageIndex);
    setSelectedImageIndex(ImageIndex);
  }, [ImageIndex]);

  const openModal = () => {
    setIsModalOpen(true);
  };
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
    setIsModalOpen(false);
  };

  return (
    <BackGround>
      <Prev
        onClick={() => {
          setViewCoverDeco(false);
          setViewStartpage(true);
        }}
      >
        <img
          src={PrevImg}
          alt="Prev Icon"
          style={{ width: "8px", height: "16px" }}
        />
      </Prev>
      <Container>
        <Title>
          <Text>표지를 꾸며주세요!</Text>
        </Title>
        <Book
          backgroundImage={books[ImageIndex]}
          //vector 포함할지 말지
        >
          <TitleContainer ref={inputRef}>
            <Input
              //onClick={setIsKeyboardOpen}
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
              selectfont={font}
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
      </Container>
      {title === "" || (ImageIndex === 0 && croppedImage === "") ? (
        <Button disabled={true} style={{ background: "#ced4da" }}>
          <ButtonTxt>완료</ButtonTxt>
        </Button>
      ) : (
        <Button
          style={{
            background: "#FFA256",
            boxShadow:
              "-1px -1px 0.4px 0px rgba(0, 0, 0, 0.14), 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30)",
          }}
          onClick={() => {
            setBackgroundImage(books[ImageIndex]);
            setSelectfont(font);
            setViewCoverDeco(false);
            setViewFinalInfo(true);
          }}
        >
          <ButtonTxt>완료</ButtonTxt>
        </Button>
      )}
      {isModalOpen && (
        <ImageCropper
          key={cropperKey}
          setIsModalOpen={setIsModalOpen}
          originalImage={originalImage}
          croppedAreaPixels={croppedAreaPixels}
          setCroppedImage={handleSaveCroppedImage} // 크롭된 이미지를 저장하는 함수
          setCroppedAreaPixels={setCroppedAreaPixels}
        />
      )}
    </BackGround>
  );
}

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    #d3edff 0%,
    #e7f6f7 46.2%,
    #feffee 97.27%
  );
  background-blend-mode: overlay, normal;
  overflow: hidden;
`;
const Prev = styled.span`
  position: absolute;
  cursor: pointer;
  top: 16px;
  left: 24px;
`;
const Container = styled.div`
  display: flex;
  //position: relative;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1 0 0;
  align-self: stretch;
  margin-top: 3.5rem;
  margin-bottom: 6rem;
  overflow: hidden;
`;
const Button = styled.button`
  overflow: hidden;
  position: fixed;
  width: 288px;
  cursor: pointer;
  display: flex;
  height: 48px;
  padding: 14px 20px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 36rem;
  align-self: stretch;
  border-radius: 50px;
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
const Title = styled.div`
  position: fixed;
  display: flex;
  margin-top: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;
const Text = styled.span`
  //position: fixed;
  display: block;
  color: #243348;
  text-align: center;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Book = styled.div<{ backgroundImage: string }>`
  width: 224px;
  height: 292px;
  position: fixed;
  margin-top: 3.2rem;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.backgroundImage});
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //background: linear-gradient(150deg, #4bb9ff 1.91%, #4be 103.28%);
`;
const TitleContainer = styled.div`
  display: flex;
  width: 224px;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
`;
const Input = styled.input<{ selectfont: string }>`
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
    font-family: ${(props) => props.selectfont};
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
    font-family: ${(props) => props.selectfont};
    font-size: ${(props) =>
      props.selectfont === "Ownglyph_UNZ-Rg" ? "20px" : "16px"};
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
const BtnImgContainer = styled.div<{ bgimg: string }>`
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
  background-image: url(${(props) => props.bgimg});
   background-size: cover; /* 이미지 크기를 컨테이너에 맞게 조정 */
  background-position: center; /* 이미지가 중앙에 위치하도록 */
  background-repeat: no-repeat; /* 이미지가 반복되지 않도록 */
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

//개수 초과 시 우측 슬라이드 기능 - 디자인 확정 시
