import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PrevImg from "../../../../public/assets/pageprev.svg";
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
import bright from "../../../../public/assets/border.svg";
import shadow from "../../../../public/assets/shadow2.svg";
import bookshadow from "../../../../public/assets/book_shadow.svg";
import FontSelect from "./FontSelect";
import ImageCropper from "./ImageCropper";
import { Area } from "react-easy-crop";

const fonts = [
  { name: "서체1", family: "GmarketSans" },
  { name: "서체2", family: "Ownglyph_UNZ-Rg" },
  { name: "서체3", family: "CookieRun-Regular" },
  { name: "서체4", family: "Cafe24ClassicType-Regular" },
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
  const images = [image1, image2, image3, image4, image5];
  const books = [basic, book2, book3, book4, book5];
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
      imgRef.current.value = ""; // 파일 입력 필드를 초기화
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
        <Book backgroundImage={books[ImageIndex]}>
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
              <>
                <Bright src={bright} />
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
                    style={{
                      width: "24px",
                      height: "24px",
                      marginLeft: "1.5px",
                    }}
                  />
                  <BtnTxt>사진 추가</BtnTxt>
                </ButtonContainer>
              </>
            ) : (
              <>
                <Bright src={bright} />
                <Shadow src={shadow} />
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
        <BookShadow>
          <img src={bookshadow} alt="book_shadow" />
        </BookShadow>
        <ImageContainer>
          {images.map((img, index) => (
            <Image
              onClick={() => handleImageClick(index)}
              clicked={ImageIndex === index}
              key={index}
              img={img}
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
          borderRadius={20}
        />
      )}
    </BackGround>
  );
}
const BookShadow = styled.div`
  flex-shrink: 0;
  position: relative;
  margin-top: 333.1px;
`;
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;
const TitleContainer = styled.div`
  display: flex;
  width: 224px;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Input = styled.input<{ selectfont: string }>`
  box-sizing: border-box;
  display: flex;
  width: 184px;
  padding: var(--Border-Radius-radius_300, 8px) 16px;
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
    font-family: ${(props) => props.selectfont};
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
    font-family: ${(props) => props.selectfont};
    font-size: ${(props) =>
      props.selectfont === "Ownglyph_UNZ-Rg" ? "24px" : "16px"};
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
  z-index: 100;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ButtonContainer = styled.button`
  z-index: 1;
  position: relative;
  cursor:pointer;
  display: flex;
  width: 134px;
  height: 134px;
  margin-left: 46px;
  margin-top:16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px
  flex-shrink: 0;
  border-radius: 20px;
  background: #e9ecef;
  border: 1px solid var(--Color-grayscale-gray200, #E9ECEF);
  &:focus {
  border: none;
    outline: none;
  }
`;
const Bright = styled.img`
  margin-left: 40.5px;
  margin-top: 10.8px;
  position: absolute;
  z-index: 3;
  flex-shrink: 0;
  width: 145px;
  height: 145px;
  pointer-events: none;
`;
const Shadow = styled.img`
  width: 159px;
  height: 159px;
  margin-left: 33.5px;
  margin-top: 3.9px;
  position: absolute;
  z-index: 3;
  pointer-events: none;
  flex-shrink: 0;
  object-fit: cover;
`;
const BtnImgContainer = styled.div<{ bgimg: string }>`
  display: flex;
  z-index: 2;
  cursor:pointer;
  position: relative; 
  width: 134px;
  height: 134px;
  margin-left: 46px;
  margin-top:16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px
  flex-shrink: 0;
  border-radius: 20px;
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
const NameBar = styled.div`
  margin-top: 20px;
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
const ImageContainer = styled.div`
  position: fixed;
  margin-top: 24.2rem;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  align-self: stretch;
  left: 50%;
  transform: translateX(-50%);
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
  background-size: cover; /* 이미지 크기를 컨테이너에 맞게 조정 */
  background-position: center; /* 이미지가 중앙에 위치하도록 */
  background-repeat: no-repeat; /* 이미지가 반복되지 않도록 */
`;
