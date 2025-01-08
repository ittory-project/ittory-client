import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import X from "../../../../public/assets/x.svg";
import camera from "../../../../public/assets/camera.svg";
import axios from "axios";
import { Area } from "react-easy-crop";
import shadow from "../../../../public/assets/shadow2.svg";
import camera_mini from "../../../../public/assets/camera_mini.svg";
import { CoverType } from "../../../api/model/CoverType";
import { getCoverTypes } from "../../../api/service/CoverService";
import { getAllFont } from "../../../api/service/FontService";
import { fontProps } from "../CoverDeco/CoverStyle";
import FontPopup from "../CoverDeco/FontPopup";
import { postCoverImage } from "../../../api/service/ImageService";
import { ImageUrlRequest } from "../../../api/model/ImageModel";

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
export enum ImageExtension {
  JPG = "JPG",
  JPEG = "JPEG",
  PNG = "PNG",
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
  const [originalImage, setOriginalImage] = useState<string>("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [, setCropperKey] = useState<number>(0);
  const [, setBookimage] = useState<number>(backgroundimage - 1);
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [fontPopup, setFontPopup] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>(
    String(backgroundimage)
  );
  const [ImageIndex, setImageIndex] = useState<number>(backgroundimage);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [fonts, setFonts] = useState<fontProps[]>([]);
  const [font, setFont] = useState<string>(selectfont);
  const [selectf, setSelectf] = useState<string>("");
  const [selectfid, setSelectfid] = useState<number>(0);

  useEffect(() => {
    const imageUrl = coverTypes[ImageIndex]?.editImageUrl;

    if (imageUrl) {
      setBackgroundImage(imageUrl);
    }
  }, [ImageIndex, coverTypes]);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const types = await getAllFont();
        setFonts(types);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFonts();
    setSelectfid(selectFid);
  }, []);

  useEffect(() => {
    const fetchCoverTypes = async () => {
      try {
        const types = await getCoverTypes();
        setCoverTypes(types);
        console.log(types);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoverTypes();
  }, []);

  useEffect(() => {
    setImageIndex(selectedImageIndex);
  }, [selectedImageIndex, croppedImage]);

  const handleFinalCover = () => {
    localStorage.setItem("title", title);
    localStorage.setItem("image", croppedImage);
    localStorage.setItem("bgImg", String(ImageIndex));
    localStorage.setItem("font", font);
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
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
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
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [inputRef]);

  useEffect(() => {
    const handleSaveClick = async () => {
      {
        if (croppedAreaPixels) {
        }
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

  const handleImageClick = (index: number) => {
    setImageIndex(index);
    setBookimage(index);
  };

  const closeCoverModal = () => {
    setIsModalOpen(false);
  };

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

  return (
    <ModalContainer
      ref={modalBackground}
      $keyboardHeight={keyboardHeight}
      $isKeyboardOpen={isKeyboardOpen}
    >
      <Header>
        <Title>표지 수정하기</Title>
        <Cancel onClick={closeCoverModal}>
          <img src={X} alt="X Icon" style={{ width: "14px", height: "14px" }} />
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
        {croppedImage === "" ? (
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
            <Shadow src={shadow} />
            <BtnImgContainer
              $bgimg={croppedImage}
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
  $keyboardHeight: number;
  $isKeyboardOpen: boolean;
}>`
  position: absolute;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: ${({ $isKeyboardOpen, $keyboardHeight }) =>
    $isKeyboardOpen ? `calc(33rem - ${$keyboardHeight}px)` : "33rem"};
  padding: 24px 24px 20px 0px;
  bottom: 1px;
  border-radius: 24px 24px 0px 0px;
  background: #fff;
  z-index: 50;
  flex-direction: column;
  //align-items: center;
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
  padding-left: 24px;
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
const Book = styled.div<{ $backgroundImage: string }>`
  width: 224px;
  height: 294px;
  position: absolute;
  margin-top: 3rem;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.$backgroundImage});
  display: flex;
  align-items: center;
  flex-direction: column;
  background-size: cover; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
  left: 50%;
  transform: translateX(-50%);
`;
const Shadow = styled.img`
  width: 158px;
  height: 153px;
  margin-left: -3px;
  margin-top: 76px;
  position: absolute;
  z-index: 3;
  pointer-events: none;
  flex-shrink: 0;
  object-fit: cover;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  width: 135.7px;
  height: 135.7px;
  z-index: 0;
  cursor: pointer;
  position: relative;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 20px;
  background-image: url(${(props) => props.$bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 17px;
`;
const TitleContainer = styled.div`
  display: flex;
  width: 224px;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Input = styled.input<{ $font: string }>`
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
  cursor: pointer;
  &::placeholder {
    line-height: 24px;
    color: #f1f3f5;
    text-align: center;
    text-overflow: ellipsis;
    font-family: ${(props) => props.$font};
    font-size: ${(props) =>
      props.$font === "Ownglyph_UNZ-Rg" ? "24px" : "16px"};
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    text-align: center;
  }
  &:valid {
    color: #f1f3f5;
    text-align: center;
    text-overflow: ellipsis;
    font-family: ${(props) => props.$font};
    font-size: ${(props) =>
      props.$font === "Ownglyph_UNZ-Rg" ? "24px" : "16px"};
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.5px;
    line-height: 24px;
  }
  &:focus {
    outline: none;
  }
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
  position: relative;
  margin-top: 21rem;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  align-self: stretch;
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Button = styled.button<{ $isKeyboardOpen: boolean }>`
  box-sizing: border-box;
  display: ${(props) =>
    props.$isKeyboardOpen
      ? "none"
      : "flex"}; /* 키보드가 올라왔을 때 버튼 숨김 */
  width: 288px;
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
