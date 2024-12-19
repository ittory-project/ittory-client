import { Area } from "react-easy-crop";

export default async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  size: { width: number; height: number }
): Promise<string> {
  const image = new Image();
  image.src = imageSrc;

  // Ensure the image is loaded before proceeding
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load image"));
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }
  // 크롭된 영역을 캔버스에 그리기 위한 코드
  canvas.width = size.width;
  canvas.height = size.height;

  // 이미지 크기와 크롭 영역을 맞추기 위한 비율 계산
  const scaleX = image.width / size.width;
  const scaleY = image.height / size.height;
  console.log(scaleX, scaleY);

  // 크롭 영역의 위치와 크기 계산
  const cropX = crop.x * scaleX + 70;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX * 1.335; // 크롭 영역의 너비
  const cropHeight = crop.height * scaleY * 1.32; //높이

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    size.width,
    size.height
  );

  // Convert canvas to blob and return as a data URL
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const fileUrl = URL.createObjectURL(blob);
          resolve(fileUrl);
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      },
      "image/jpeg",
      1.0 // Quality (optional)
    );
  });
}
