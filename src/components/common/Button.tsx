import styled from "styled-components";

interface ButtonProps {
  text: string;
  color: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, color, onClick }) => {
  return (
    <Btn color={color} onClick={onClick}>
      {text}
    </Btn>
  );
};

export default Button;

const Btn = styled.div<{color: string}>`
  background-color: ${(props) => props.color};
  width: 100%;
  height: 48px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;

  border: solid rgba(100, 100, 100, 0.3);
  border-top-color: rgba(255, 255, 255, 0.3);
  border-top-width : 2px;
  border-right-width : 2px;
  border-bottom-width : 2px;
  border-left-width : 0px;
`;