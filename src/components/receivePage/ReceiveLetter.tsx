import styled from "styled-components";

export const ReceiveLetter = () => {
  return (
      <Background>편지내용</Background>
  );
}

const Background = styled.div`
  height: 100vh;
  background: linear-gradient(180deg, #F3C183 0%, #F0F5BF 100%);
  background-blend-mode: overlay, normal;
`