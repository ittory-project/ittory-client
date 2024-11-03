import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import styled from "styled-components";
import PrevImg from "../../../../public/assets/pageprev.svg";
import camera from "../../../../public/assets/camera.svg";
import shadow from "../../../../public/assets/shadow2.svg";
import bookshadow from "../../../../public/assets/book_shadow.svg";
import FontSelect from "./FontSelect";
import ImageCropper from "./ImageCropper";
import { Area } from "react-easy-crop";
import axios from "axios";
import FontPopup from "./FontPopup";
import { getCoverTypes } from "../../../../src/api/service/CoverService";
import { CoverType } from "../../../../src/api/model/CoverType";
import { getAllFont } from "../../../api/service/FontService";
import { Font } from "../../../api/model/FontModel";
import { postFont } from "../../../api/service/FontService";

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
  setBackgroundImage: React.Dispatch<React.SetStateAction<number>>;
  setSelectfont: React.Dispatch<React.SetStateAction<string>>;
  setViewFinalInfo: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
}
interface BookProps {
  backgroundImage: string;
  children: ReactNode;
}

const Book: React.FC<BookProps> = React.memo(
  ({ backgroundImage, children }) => {
    return (
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "224px",
          height: "292px",
          marginTop: "48px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    );
  }
);
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
  const imgRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropperKey, setCropperKey] = useState<number>(0);
  const [ImageIndex, setImageIndex] = useState<number>(0);
  const [fontPopup, setFontPopup] = useState<boolean>(false);
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [backgroundImage, setBackgroundImageState] = useState<string>("");

  useEffect(() => {
    const fetchCoverTypesAndFonts = async () => {
      try {
        const types = await getCoverTypes();
        setCoverTypes(types);
        console.log(types);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoverTypesAndFonts();
  }, []);

  const handleImageClick = (index: number) => {
    setImageIndex(index);
  };

  const handlePopup = () => {
    setFontPopup(true);
  };

  useEffect(() => {
    console.log("Updated selectedImageIndex:", selectedImageIndex);
    setSelectedImageIndex(ImageIndex);
  }, [ImageIndex]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  /*
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
  }, [inputRef]);*/

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const heightDiff =
        window.innerHeight - document.documentElement.clientHeight;

      // 키보드가 열리는 조건 - 이부분 나중에 테스트 필요!!
      if (inputRef.current && inputRef.current.contains(e.target as Node)) {
        if (heightDiff > 0) {
          setIsKeyboardOpen(true);
          setKeyboardHeight(heightDiff);
          inputRef.current.focus();
        } else {
          setIsKeyboardOpen(false);
          setKeyboardHeight(0);
          handlePopup();
        }
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

  const handleFont = async () => {
    try {
      const newFont = await postFont(font); // 선택한 폰트를 서버에 POST
      console.log("Font posted successfully:", newFont);
    } catch (error) {
      console.error("Error posting font:", error);
    }
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
        <Book backgroundImage={coverTypes[ImageIndex]?.editImageUrl}>
          <TitleContainer>
            <Input
              ref={inputRef}
              //onClick={setIsKeyboardOpen}
              id="title-input" // id 속성 추가
              name="title" // name 속성 추가
              placeholder="제목 최대 12자"
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = e.target.value.slice(0, 12); // 최대 길이 12자로 제한
                setTitle(newValue);
              }}
              minLength={1}
              maxLength={12}
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

            {isKeyboardOpen == true ? (
              <KeyboardBar keyboardHeight={keyboardHeight}>
                <FontSelect font={font} fonts={fonts} setFont={setFont} />
              </KeyboardBar>
            ) : (
              <></>
            )}
          </TitleContainer>

          {ImageIndex !== 4 ? (
            croppedImage === "" ? (
              <>
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
          {coverTypes.map((coverType, index) => (
            <Image
              onClick={() => handleImageClick(index)}
              clicked={ImageIndex === index}
              key={index}
              img={
                ImageIndex === index
                  ? coverType.selectImageUrl
                  : coverType.listImageUrl
              }
              className="image"
            />
          ))}
        </ImageContainer>
      </Container>
      {title === "" || croppedImage === "" ? (
        <Button disabled={true} style={{ background: "#ced4da" }}>
          <ButtonTxt>꾸미기 완료</ButtonTxt>
        </Button>
      ) : (
        <Button
          style={{
            background: "#FFA256",
            boxShadow:
              "-1px -1px 0.4px 0px rgba(0, 0, 0, 0.14), 1px 1px 0.4px 0px rgba(255, 255, 255, 0.30)",
          }}
          onClick={() => {
            handleFont();
            setBackgroundImage(ImageIndex + 1);
            setSelectfont(font);
            setViewCoverDeco(false);
            setViewFinalInfo(true);
          }}
        >
          <ButtonTxt>꾸미기 완료</ButtonTxt>
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
      {fontPopup && (
        <FontPopup
          font={font}
          fonts={fonts}
          setFont={setFont}
          setFontPopup={setFontPopup}
        />
      )}
    </BackGround>
  );
}
const BookShadow = styled.div`
  flex-shrink: 0;
  position: relative;
  margin-top: -7.67px;
`;
const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  //position: relative;
  //left: 50%;
  //transform: translateX(-50%);
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
  flex: 1 0 0;
  //align-self: stretch;
  width: 100%;
  height: 100%;
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
  bottom: 20px;
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
const TitleContainer = styled.div`
  display: flex;
  width: 184px;
  padding: 16px 16px;
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
  margin-left: 45px;
  margin-top:13px;
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
const Shadow = styled.img`
  width: 159px;
  height: 159px;
  margin-left: 31.5px;
  margin-top: 0px;
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
  margin-left: 44.2px;
  margin-top:13.4px;
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
  margin-top: 31.95px;
  width: 224px;
  height: 23px;
  flex-shrink: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NameContainer = styled.div`
  width: 224px;
  height: 21px;
  flex-shrink: 0;
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
  margin-top: 23.5rem;
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
  background-image: url(${(props) => props.img});
  background-size: cover; /* 이미지 크기를 컨테이너에 맞게 조정 */
  background-position: center; /* 이미지가 중앙에 위치하도록 */
  background-repeat: no-repeat; /* 이미지가 반복되지 않도록 */
`;
