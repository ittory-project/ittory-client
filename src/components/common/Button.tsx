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
    width: 90%;
    height: 48px;
    text: 25px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
`;