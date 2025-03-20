import styled from "styled-components";
import { CoverTypeGetResponse } from "../../api/model/CoverTypeModel";
import { FontGetResponse } from "../../api/model/FontModel";
import { LetterDetailGetResponse } from "../../api/model/LetterModel";
import { formatDate } from "../../api/config/formatData";

interface LetterContentProps {
  letterStyle: CoverTypeGetResponse;
  letterFontStyle: FontGetResponse;
  letterContent: LetterDetailGetResponse;
}

export const ReceiveLetterCover = ({
  letterStyle,
  letterFontStyle,
  letterContent,
}: LetterContentProps) => {
  const partiList = letterContent.participantNames
    .map((element) => element)
    .join(", ");

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = "/img/profile.png";
  };

  return (
    <>
      <CoverImage src={letterStyle.editImageUrl} alt="Cover" />
      <CoverContent>
        <TitleDiv $fonttype={letterFontStyle.name}>
          {letterContent.title}
        </TitleDiv>
        <DateDiv $fonttype={letterFontStyle.name}>
          {formatDate(letterContent.deliveryDate)}
        </DateDiv>
        <PhotoDiv>
          <ProfileImage
            src={"" + letterContent.coverPhotoUrl}
            onError={handleImageError}
          />
        </PhotoDiv>
        <DescriptionDiv
          $coverId={letterStyle.id}
          $fonttype={letterFontStyle.name}
        >
          {partiList}
        </DescriptionDiv>
      </CoverContent>
    </>
  );
};

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const CoverContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px;
  color: #333;
`;

const TitleDiv = styled.div<{ $fonttype: string }>`
  font-size: 22px;
  display: flex;
  font-weight: bold;
  margin-bottom: 10px;
  justify-content: center;
  overflow: hidden;
  color: var(--color-black-white-white, #fff);
  text-align: center;
  text-overflow: ellipsis;
  font-family: ${(props) => props.$fonttype};
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 120% */
  letter-spacing: -0.5px;
`;

const DateDiv = styled.div<{ $fonttype: string }>`
  font-size: 16px;
  display: flex;
  color: #666;
  margin-bottom: 20px;
  justify-content: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  text-overflow: ellipsis;
  font-family: ${(props) => props.$fonttype};
  font-size: var(--Typography-size-2xs, 11px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px); /* 145.455% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PhotoDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 35px;
`;

const ProfileImage = styled.img`
  width: 164px;
  height: 164px;
  border-radius: 20px;
  object-fit: cover;
`;

const DescriptionDiv = styled.div<{ $coverId: number; $fonttype: string }>`
  height: 16px;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  font-family: ${(props) => props.$fonttype};
  color: ${({ $coverId }) => {
    if ($coverId === 1) return "#715142";
    if ($coverId === 2) return "#335839";
    if ($coverId === 3) return "#985566";
    if ($coverId === 4) return "#232D3D";
    if ($coverId === 5) return "#232D3D";
  }};
  margin-top: ${(props) =>
    props.$coverId === 1 || props.$coverId === 2 ? "45px" : "35px"};
  font-size: var(--Typography-size-2xs, 11px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px);
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;
