import { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../../../public/assets/home/smalllogo.png';
import menu from '../../../public/assets/home/menulogo.svg';

interface Props {
  backgroundColor: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuOpen: boolean;
}

export default function Header({ backgroundColor, setIsMenuOpen }: Props) {
  const [bgColor, setBgColor] = useState<boolean>(backgroundColor);

  const handleMenu = () => {
    setIsMenuOpen(true);
  };

  useEffect(() => {
    setBgColor(backgroundColor);
  }, [backgroundColor]);

  return (
    <Container $color={bgColor}>
      {bgColor && <Logo src={logo} />}{' '}
      <MenuLogo src={menu} onClick={handleMenu} />
    </Container>
  );
}

const Container = styled.div<{ $color: boolean }>`
  background: ${(props) => (props.$color ? '#fff' : 'transparent')};
  position: absolute;
  top: 0;
  display: flex;
  width: 100%;
  margin: 0 auto;
  height: 48px;
  box-sizing: border-box;
  z-index: 1;
  padding: 0px 4px 0px 16px;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${(props) =>
    props.color ? '0px 4px 4px 0px rgba(0, 0, 0, 0.05)' : 'none'};
  transition:
    background 0.4s ease,
    box-shadow 0.4s ease;
`;

const Logo = styled.img`
  display: flex;
  width: 58px;
  height: 28px;
  padding: 4px;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
`;

const MenuLogo = styled.img`
  position: absolute;
  right: 12px;
  display: flex;
  width: 24px;
  height: 24px;
  padding: 5px 3px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
