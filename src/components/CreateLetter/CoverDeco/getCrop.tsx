import { Area } from "react-easy-crop";

export default async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  size: { width: number; height: number }
): Promise<string> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // 캔버스 크기 설정
  canvas.width = size.width;
  canvas.height = size.height;

  const scaleX = image.width / size.width;
  const scaleY = image.height / size.height;
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // 캔버스를 이미지 URL로 변환하여 반환
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }
    }, "image/jpeg");
  });
}
//좀 더 미세하게 조정하기 (정확하게)
