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
import { Area } from "react-easy-crop";
import FontPopup from "./FontPopup";
import { getCoverTypes } from "../../../../src/api/service/CoverService";
import { CoverType } from "../../../../src/api/model/CoverType";
import { getAllFont } from "../../../api/service/FontService";
import axios from "axios";
import { ImageUrlRequest } from "../../../api/model/ImageModel";
import { postCoverImage } from "../../../api/service/ImageService";

interface Props {
  setViewCoverDeco: React.Dispatch<React.SetStateAction<boolean>>;
  setViewStartpage: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  croppedImage: string;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundimage: React.Dispatch<React.SetStateAction<number>>;
  setSelectfont: React.Dispatch<React.SetStateAction<string>>;
  setViewFinalInfo: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectFid: React.Dispatch<React.SetStateAction<number>>;
}
interface BookProps {
  backgroundimage: string;
  children: ReactNode;
}
export interface fontProps {
  id: number;
  name: string;
  value: string;
}
export enum ImageExtension {
  JPG = "JPG",
  JPEG = "JPEG",
  PNG = "PNG",
}

const Book: React.FC<BookProps> = React.memo(
  ({ backgroundimage, children }) => {
    return (
      <div
        style={{
          backgroundImage: `url(${backgroundimage})`,
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
  setBackgroundimage,
  setSelectfont,
  setViewFinalInfo,
  selectedImageIndex,
  setSelectedImageIndex,
  setSelectFid,
}: Props) {
  const [, setIsKeyboardOpen] = useState<boolean>(false);
  const [, setKeyboardHeight] = useState<number>(0);

  const imgRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen] = useState<boolean>(false);
  const [, setCropperKey] = useState<number>(0);
  const [ImageIndex, setImageIndex] = useState<number>(0);
  const [fontPopup, setFontPopup] = useState<boolean>(false);
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [fonts, setFonts] = useState<fontProps[]>([]);
  const [font, setFont] = useState<string>("");
  const [selectf, setSelectf] = useState<string>("");
  const [selectfid, setSelectfid] = useState<number>(1);
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const imageUrl = coverTypes[ImageIndex]?.editImageUrl;

    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  }, [ImageIndex, coverTypes]);

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

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const types = await getAllFont();
        setFonts(types);
        console.log(types);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFonts();
  }, []);

  useEffect(() => {
    if (fonts.length > 0 && fonts[0]?.name) {
      setFont(fonts[0].value);
      setSelectfid(fonts[0].id);
    }
  }, [fonts]);

  const handleImageClick = (index: number) => {
    setImageIndex(index);
  };

  useEffect(() => {
    console.log("Updated selectedImageIndex:", selectedImageIndex);
    setSelectedImageIndex(ImageIndex);
  }, [ImageIndex]);

  // 폰트 바를 클릭할 때 input에 포커스를 유지시켜 키보드가 내려가지 않도록 하기
  const handlePopupClick = (e: React.MouseEvent) => {
    console.log("팝업 클릭 함수 실행");
    // FontPopup을 클릭하면 input에 포커스를 유지
    if (popupRef.current) {
      console.log("팝업 클릭함");
      if (inputRef.current) {
        console.log("인풋에 포커스");
        inputRef.current.focus();
      }
      // input에 포커스를 유지시켜 키보드를 올려둠
    }
    e.stopPropagation(); // 이벤트 전파를 막아 다른 요소가 클릭되지 않도록 함
  };

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
      if (currentHeightDiff < 0) {
        currentHeightDiff = Math.max(0, currentHeightDiff); // 음수는 0으로 처리
      }

      if (inputRef.current && inputRef.current.contains(e.target as Node)) {
        if (currentHeightDiff > 0) {
          if (window.innerWidth < 850) {
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
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [inputRef]);

  useEffect(() => {
    const handleSaveClick = async () => {
      {
        if (originalImage !== "") {
          //Blob으로 변경
          const responseBlob = await fetch(originalImage).then((res) =>
            res.blob()
          );
          console.log(responseBlob);

          // Step 1: URL 발급 요청
          const imageUrlRequest: ImageUrlRequest = {
            imgExtension: ImageExtension.JPG,
          };

          try {
            const { preSignedUrl, key } = await postCoverImage(imageUrlRequest);
            console.log("PreSigned URL: ", preSignedUrl);

            // Step 2: presigned URL로 이미지 업로드
            await fetch(preSignedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "image/jpeg", // MIME type 설정
              },
              body: responseBlob, // Blob으로 변환된 이미지 본문에 추가
            });

            // Step 3: 업로드가 완료되면 S3 URL 생성
            const s3ImageUrl = `https://ittory.s3.ap-northeast-2.amazonaws.com/${key}`;
            console.log("Image uploaded successfully to S3!");
            console.log("Image URL: ", s3ImageUrl);
            setCroppedImage(s3ImageUrl);
            setCroppedAreaPixels(null);
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error(
                "Error uploading image: ",
                error.response?.data || (error as Error).message // 타입 단언 추가
              );
            } else {
              console.error("Unexpected error: ", error);
            }
          }
          setCroppedAreaPixels(null);
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
      console.log("New Image URL: ", newImageUrl);
      setOriginalImage(newImageUrl); // 원본 이미지를 설정
      setCroppedAreaPixels(null);
      setCropperKey((prevKey) => prevKey + 1); // Cropper의 key를 변경하여 강제로 리렌더링
    },
    []
  );

  const onUploadImageButtonClick = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.value = ""; // 파일 입력 필드를 초기화
      imgRef.current.click();
    }
  }, []);

  return (
    <BackGround>
      <Overlay $isOpen={isModalOpen} />
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
        <Book backgroundimage={backgroundImage}>
          <TitleContainer>
            <Input
              ref={inputRef}
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
              $selectfont={font}
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

          {croppedImage === "" ? (
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
                $bgimg={croppedImage}
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
          )}
          <NameContainer $book={ImageIndex}>
            <NameTxt $book={ImageIndex}>
              자동으로 참여자 이름이 들어갈 거예요
            </NameTxt>
          </NameContainer>
        </Book>
        <BookShadow>
          <img src={bookshadow} alt="book_shadow" />
        </BookShadow>
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
            setSelectfont(font);
            setBackgroundimage(ImageIndex);
            setSelectFid(selectfid);
            setViewCoverDeco(false);
            setViewFinalInfo(true);
          }}
        >
          <ButtonTxt>꾸미기 완료</ButtonTxt>
        </Button>
      )}
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
    </BackGround>
  );
}
const Overlay = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
  background: rgba(0, 0, 0, 0.6);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
  z-index: 10;
`;
const BookShadow = styled.div`
  flex-shrink: 0;
  position: relative;
  margin-top: -7.67px;
`;
const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
  justify-content: center;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
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
  margin-top: 48px;
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
  top: 3rem;
  left: 50%; /* 수평 중앙 정렬 */
  transform: translateX(-50%); /* 중앙 정렬 보정 */
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
  width: 190px;
  padding: 16px 16px;
  justify-content: center;
  align-items: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Input = styled.input<{ $selectfont: string }>`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 40px;
  text-align: center;
  border: 0;
  background: rgba(255, 255, 255, 0);
  cursor: pointer;
  &::placeholder {
    line-height: 24px;
    color: #f1f3f5;
    text-align: center;
    text-overflow: ellipsis;
    font-family: ${(props) => props.$selectfont};
    font-size: ${(props) =>
      props.$selectfont === "Ownglyph_UNZ-Rg" ? "24px" : "16px"};
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    opacity: 0.5;
  }
  &:valid {
    color: #fff;
    text-align: center;
    font-family: ${(props) => props.$selectfont};
    font-size: ${(props) =>
      props.$selectfont === "Ownglyph_UNZ-Rg" ? "24px" : "16px"};
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    line-height: 24px;
  }
  &:focus {
    outline: none;
  }
`;

const ButtonContainer = styled.button`
  z-index: 0;
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
  background: #fff;
  border: 1px solid var(--Color-grayscale-gray200, #E9ECEF);
  &:focus {
  border: none;
    outline: none;
  }
`;
const Shadow = styled.img`
  width: 160px;
  height: 160px;
  margin-left: 31.5px;
  margin-top: 0px;
  position: absolute;
  z-index: 3;
  pointer-events: none;
  flex-shrink: 0;
  object-fit: cover;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  display: flex;
  cursor:pointer;
  position: relative; 
  width: 135px;
  height: 135px;
  margin-left: 44.5px;
  margin-top:12.4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px
  flex-shrink: 0;
  border-radius: 20px;
  background-image: url(${(props) => props.$bgimg});
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
const NameContainer = styled.div<{ $book: number }>`
  width: 224px;
  height: 21px;
  flex-shrink: 0;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: ${(props) =>
    props.$book === 0 || props.$book === 1 ? "34px" : "25px"};
`;
const NameTxt = styled.div<{ $book: number }>`
  padding: 0 12px 0 12px;
  width: 200px;
  text-align: center;
  text-overflow: ellipsis;
  font-family: SUIT;
  font-size: 9px;
  font-style: normal;
  font-weight: 700;
  line-height: 13px;
  letter-spacing: -0.5px;
  color: ${({ $book }) => {
    if ($book === 0) return "#715142";
    if ($book === 1) return "#335839";
    if ($book === 2) return "#985566";
    if ($book === 3) return "#232D3D";
    if ($book === 4) return "#232D3D";
  }};
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
const Image = styled.div<{ $clicked: boolean; $img: string }>`
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${(props) => (props.$clicked ? "56px" : "48px")};
  height: ${(props) => (props.$clicked ? "56px" : "48px")};
  opacity: ${(props) => (props.$clicked ? "" : "0.4")};
  border-radius: 10.2px;
  flex-shrink: 0;
  background-image: url(${(props) => props.$img});
  background-size: cover; /* 이미지 크기를 컨테이너에 맞게 조정 */
  background-position: center; /* 이미지가 중앙에 위치하도록 */
  background-repeat: no-repeat; /* 이미지가 반복되지 않도록 */
`;
