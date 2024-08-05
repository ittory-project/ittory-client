import styled from "styled-components";
import memberData from "../../data/write/writeOrder.json"

export const WriteOrderPopover: React.FC = () => {
  return (
    // 상단에 순서 버튼 누르면 작게 순서 알려주는거
    <Container>
      {memberData.toString()}
    </Container>
  );
};

const Container = styled.div`
display: flex;
padding: 8px 12px 16px 12px;
flex-direction: column;
align-items: center;
gap: 8px;
position: absolute;
right: 16px;
top: 72px;
border-radius: var(--Border-Radius-radius_400, 12px);
border: 2px solid var(--Color-secondary-soft_blue, #D3EDFF);
background: var(--color-black-white-white, #FFF);
`;