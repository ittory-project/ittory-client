import { useState } from "react";
import styled from "styled-components";
import { WriteOrderPopover } from "./WriteOrderPopover";
import { LetterPartiItem } from "../../api/model/LetterModel";

interface TitleProps {
  writeOrderList: LetterPartiItem[];
  title: string;
}

export const WriteOrderTitle: React.FC<TitleProps> = ({
  writeOrderList,
  title,
}) => {
  const [isPopover, setIsPopover] = useState(false);

  const closePopover = () => {
    setIsPopover(false);
  };

  const handleOrderBtn = () => {
    setIsPopover(!isPopover);
  };

  return (
    <div>
      <OuterContainer>
        <InnerContainer>
          <LeftContent>
            <Img src="/img/write_letter_order.png" />
            {title}
          </LeftContent>
          <OrderBtn
            src={
              isPopover
                ? "/assets/write/order_btn_click.svg"
                : "/assets/write/order_btn.svg"
            }
            onClick={handleOrderBtn}
          />
        </InnerContainer>
      </OuterContainer>
      {isPopover && (
        <WriteOrderPopover
          writeOrderList={writeOrderList}
          onClose={closePopover}
        />
      )}
    </div>
  );
};

export default WriteOrderTitle;

const OuterContainer = styled.div`
  display: flex;
  height: 46px;
  padding: 2px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 8px;
  background: linear-gradient(to right, #fff, #4db4ff);
`;

const InnerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  background: #d3edff;
  color: var(--Color-secondary-dark_navy_blue, #060d24);
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 15px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
`;

const Img = styled.img`
  width: 22px;
  height: var(--Typography-size-s, 16px);
  flex-shrink: 0;
  margin: 0px 10px 0px 20px;
`;

const OrderBtn = styled.img`
  margin: 0px 10px 0px auto;
`;
