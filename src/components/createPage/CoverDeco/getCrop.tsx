import { Area } from "react-easy-crop";

export default async function getCroppedImg(
  imageSrc: string,
  crop: Area,
  size: { width: number; height: number; borderRadius: number }
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

  // Set canvas size to the desired cropped area size
  canvas.width = size.width;
  canvas.height = size.height;

  // Calculate the scale factors based on the original image and crop size
  const scaleX = image.width / size.width;
  const scaleY = image.height / size.height;

  // Calculate the cropping area in the image coordinates
  const cropX = crop.x * scaleX + 600;
  const cropY = crop.y * scaleY;
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY + 300;

  // Draw the image on the canvas
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

  // Apply rounded corners by clipping
  ctx.beginPath();
  ctx.moveTo(size.borderRadius, 0);
  ctx.lineTo(size.width - size.borderRadius, 0);
  ctx.arc(
    size.width - size.borderRadius,
    size.borderRadius,
    size.borderRadius,
    -Math.PI / 2,
    0
  );
  ctx.lineTo(size.width, size.height - size.borderRadius);
  ctx.arc(
    size.width - size.borderRadius,
    size.height - size.borderRadius,
    size.borderRadius,
    0,
    Math.PI / 2
  );
  ctx.lineTo(size.borderRadius, size.height);
  ctx.arc(
    size.borderRadius,
    size.height - size.borderRadius,
    size.borderRadius,
    Math.PI / 2,
    Math.PI
  );
  ctx.lineTo(0, size.borderRadius);
  ctx.arc(
    size.borderRadius,
    size.borderRadius,
    size.borderRadius,
    Math.PI,
    -Math.PI / 2
  );
  ctx.closePath();
  ctx.clip();

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
