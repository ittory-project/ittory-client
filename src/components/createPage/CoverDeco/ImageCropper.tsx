import React, { useCallback, useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import styled from "styled-components";
import getCroppedImg from "./getCrop";
import axios from "axios";
//301, cors에러 memberID 어떻게 조회..

interface Props {
  originalImage: string;
  setCroppedImage: (croppedImgUrl: string) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCroppedAreaPixels: (croppedAreaPixels: Area | null) => void;
  croppedAreaPixels: Area | null;
  width?: number;
  height?: number;
  borderRadius?: number;
}

export default function ImageCropper({
  originalImage, // crop할 이미지
  setCroppedImage,
  setCroppedAreaPixels,
  setIsModalOpen,
  croppedAreaPixels,
  width = 134,
  height = 134,
  borderRadius = 20,
}: Props) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const closeModal = () => {
    setIsModalOpen(false);
    setCroppedAreaPixels(null);
  }; //초기화 안됨 오류..같은거 선택시 크롭기능활성화 안됨

  const onCropComplete = useCallback(
    (croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [setCroppedAreaPixels]
  );

  // 크롭된 이미지를 저장하는 함수
  /*
  const handleSaveClick = async () => {
    if (croppedAreaPixels) {
      const croppedImgUrl = await getCroppedImg(
        originalImage,
        croppedAreaPixels,
        {
          width,
          height,
          borderRadius,
        }
      );
      console.log("Cropped Image URL: ", croppedImgUrl);
      setCroppedImage(croppedImgUrl);
      closeModal();
      // 여기서 croppedImg를 서버에 업로드하거나 다운로드 링크를 생성
    }
  };*/
  const handleSaveClick = async () => {
    if (croppedAreaPixels) {
      const croppedImgUrl = await getCroppedImg(
        originalImage,
        croppedAreaPixels,
        {
          width,
          height,
          borderRadius,
        }
      );
      console.log("Cropped Image URL: ", croppedImgUrl);
      setCroppedImage(croppedImgUrl);

      // Blob으로 변환하여 FormData에 추가
      const responseBlob = await fetch(croppedImgUrl).then((res) => res.blob());

      const formData = new FormData();
      formData.append("image", responseBlob, "cropped-image.jpg"); // Blob 추가
      formData.append("imgExtension", "JPG"); // 요청 본문에 imgExtension 추가

      // POST 요청 (301에러)
      try {
        const uploadResponse = await axios.post(
          "http://dev-server.ittory.co.kr/image/letter-cover",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Upload Response: ", uploadResponse.data);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }

      closeModal();
    }
  };

  return (
    <Container>
      <Header>
        <Text>사진 선택</Text>
      </Header>
      <CropContainer>
        <Cropper
          image={originalImage}
          crop={crop}
          zoom={zoom}
          aspect={width / height}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </CropContainer>

      <CancelBtn onClick={closeModal}>취소</CancelBtn>
      <Button onClick={handleSaveClick}>선택</Button>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 98%;
  position: absolute;
  bottom: 0;
  border-radius: 20px 20px 0px 0px;
  overflow: hidden;
`;
const Header = styled.div`
  position: absolute;
  width: 100%;
  height: 6rem;
  background: #d9d9d9;
  border-radius: 20px 20px 0px 0px;
  font-family: SUIT;
`;
const Text = styled.span`
  display: block;
  color: #243348;
  text-align: center;
  margin-top: 0.8rem;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const CropContainer = styled.div`
  position: absolute;
  background-color: #000;
  left: 0;
  right: 0;
  bottom: 0;
  height: 37.5rem;
  overflow: hidden;
`;
const Button = styled.button`
  position: absolute;
  bottom: 7%;
  right: 0;
  padding: 10px 10px;
  background-color: #000;
  color: white;
  font-size: 14px;
  font-family: SUIT;
  cursor: pointer;
  z-index: 10; /* Ensure button is on top of other elements */
`;
const CancelBtn = styled.button`
  position: absolute;
  bottom: 7%;
  left: 0;
  padding: 10px 10px;
  background-color: #000;
  color: white;
  font-size: 14px;
  font-family: SUIT;
  cursor: pointer;
  z-index: 10; /* Ensure button is on top of other elements */
`;
