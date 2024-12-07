import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import logo from "../../../public/assets/home/smalllogo.svg";
import menu from "../../../public/assets/home/menulogo.svg";
import { Menu } from "../../layout/Menu";
import { useSwipeable } from "react-swipeable";

interface Props {
  backgroundColor: boolean;
  setBackgroundColor: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ backgroundColor, setBackgroundColor }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<boolean>(backgroundColor);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  const handleOverlayClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const handleMenu = () => {
    setIsMenuOpen(true);
  };

  useEffect(() => {
    setBgColor(backgroundColor);
  }, [backgroundColor]);

  return (
    <Container color={bgColor}>
      {bgColor && <Logo src={logo} />}{" "}
      {/*<Logo src={logo} $isVisible={bgColor} />*/}
      <MenuLogo src={menu} onClick={handleMenu} />
      {isMenuOpen && (
        <>
          <MenuOverlay $isOpen={isMenuOpen} onClick={handleOverlayClick} />
          <MenuContainer $isOpen={isMenuOpen}>
            <Menu onClose={closeMenu} />
          </MenuContainer>
        </>
      )}
    </Container>
  );
}

const Container = styled.div<{ color: boolean }>`
  background: ${(props) => (props.color ? "#fff" : "transparent")};
  position: absolute;
  top: 0;
  display: flex;
  width: 100%;
  margin: 0 auto;
  height: 3rem;
  box-sizing: border-box;
  z-index: 1;
  padding: 0px 4px 0px 16px;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${(props) =>
    props.color ? "0px 4px 4px 0px rgba(0, 0, 0, 0.05)" : "none"};
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

const MenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  //max-width: 115px;
  height: auto;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
  z-index: 10;
`;
const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 260px;
  height: auto;
  min-height: 100vh;
  background: #fff;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 20;
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
`;
