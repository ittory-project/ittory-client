import styled from 'styled-components';

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

const Btn = styled.div<{ color: string }>`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 48px;

  font-size: 16px;
  font-weight: 700;

  color: #000;

  cursor: pointer;

  background-color: ${(props) => props.color};
  border: solid rgba(100, 100, 100, 0.3);
  border-top-color: rgba(255, 255, 255, 0.3);
  border-top-width: 2px;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left-width: 0px;
  border-radius: 20px;
`;
