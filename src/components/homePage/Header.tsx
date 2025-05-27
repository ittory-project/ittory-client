import { useEffect, useState } from 'react';

import styled from 'styled-components';

import menu from '@/assets/home/menulogo.svg';
import logo from '@/assets/home/smalllogo.png';

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
  position: absolute;
  top: 0;
  z-index: 1;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 48px;

  padding: 0px 4px 0px 16px;
  margin: 0 auto;

  background: ${(props) => (props.$color ? '#fff' : 'transparent')};
  box-shadow: ${(props) =>
    props.color ? '0px 4px 4px 0px rgba(0, 0, 0, 0.05)' : 'none'};

  transition:
    background 0.4s ease,
    box-shadow 0.4s ease;
`;

const Logo = styled.img`
  display: flex;

  flex-shrink: 0;

  gap: 16px;
  align-items: center;

  width: 58px;
  height: 28px;

  padding: 4px;
`;

const MenuLogo = styled.img`
  position: absolute;
  right: 12px;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  padding: 5px 3px;

  cursor: pointer;
`;
