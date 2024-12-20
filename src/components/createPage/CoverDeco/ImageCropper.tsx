import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import styled from "styled-components";
import getCroppedImg from "./getCrop";
import axios from "axios";
import { ImageUrlRequest } from "../../../api/model/ImageModel";
import { postCoverImage } from "../../../api/service/ImageService";

interface Props {
  originalImage: string;
  setCroppedImage: (croppedImgUrl: string) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCroppedAreaPixels: (croppedAreaPixels: Area | null) => void;
  croppedAreaPixels: Area | null;
  width?: number;
  height?: number;
}

export enum ImageExtension {
  JPG = "JPG",
  JPEG = "JPEG",
  PNG = "PNG",
}

export default function ImageCropper({
  originalImage, // crop할 이미지
  setCroppedImage,
  setCroppedAreaPixels,
  setIsModalOpen,
  croppedAreaPixels,
  width = 134,
  height = 134,
}: Props) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const closeModal = () => {
    setIsModalOpen(false);
    setCroppedAreaPixels(null);
  };

  const onCropComplete = useCallback(
    (croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [setCroppedAreaPixels]
  );

  const handleSaveClick = async () => {
    {
      if (croppedAreaPixels) {
      }
      /*const croppedImgUrl = await getCroppedImg(
        originalImage,
        croppedAreaPixels,
        {
          width,
          height,
        }
      );
      console.log("Cropped Image URL: ", croppedImgUrl);*/

      //Blob으로 변경
      const responseBlob = await fetch(originalImage).then((res) => res.blob());
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
    }
    closeModal();
  };

  return (
    <Container>
      <Header>
        <Text>사진을 업로드 하시겠습니까?</Text>
      </Header>
      <CancelBtn onClick={closeModal}>취소</CancelBtn>
      <Button onClick={handleSaveClick}>선택</Button>
    </Container>
  );
}
/*<CropContainer>
        <Cropper
          image={originalImage}
          crop={crop}
          zoom={zoom}
          aspect={width / height}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </CropContainer>*/

const Container = styled.div`
  width: 100%;
  height: 60%;
  position: absolute;
  bottom: 0;
  border-radius: 20px 20px 0px 0px;
  overflow: hidden;
  z-index: 100;
`;
const Header = styled.div`
  position: absolute;
  width: 100%;
  z-index: 3;
  height: 50px;
  background: #d9d9d9;
  border-radius: 20px 20px 0px 0px;
  font-family: SUIT;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center;
`;
const Text = styled.span`
  display: block;
  margin-top: 12px;
  color: #243348;
  text-align: center;
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
  height: 99%;
  overflow: hidden;
`;
const Button = styled.button`
  position: absolute;
  bottom: 50%;
  right: 30%;
  padding: 10px 10px;
  background-color: transparent;
  color: white;
  font-size: 14px;
  font-family: SUIT;
  cursor: pointer;
  z-index: 10; /* Ensure button is on top of other elements */
`;
const CancelBtn = styled.button`
  position: absolute;
  bottom: 50%;
  left: 30%;
  padding: 10px 10px;
  background-color: transparent;
  color: white;
  font-size: 14px;
  font-family: SUIT;
  cursor: pointer;
  z-index: 10; /* Ensure button is on top of other elements */
`;
