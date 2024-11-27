import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import logo from "../../../public/assets/home/smalllogo.svg";
import menu from "../../../public/assets/home/menulogo.svg";
import { Menu } from "../../layout/Menu";
import { useSwipeable } from "react-swipeable";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  const handleOverlayClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setIsMenuOpen(true),
  });

  const handleMenu = () => {
    setIsMenuOpen(true);
  };
  return (
    <Container>
      <Logo src={logo} />
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

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 3rem;
  box-sizing: border-box;
  z-index: 100;
  padding: 0px 4px 0px 16px;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
  z-index: 10;
`;
const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 260px;
  height: 100%;
  background: #fff;
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 20;
`;

const MenuLogo = styled.img`
  display: flex;
  width: 24px;
  height: 24px;
  padding: 5px 3px;
  justify-content: center;
  align-items: center;
`;
