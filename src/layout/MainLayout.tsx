import React, { useState, useCallback } from "react";
import MediaQuery from "react-responsive";
import styled from "styled-components";
import "../App.css";
import { Menu } from "./Menu";
import { useSwipeable } from "react-swipeable";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
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

  //<div className="MainLayout large-screen">{children}</div>
  return (
    <div className="App">
      <MediaQuery minWidth={431}>
        <div className="MainLayout large-screen" {...swipeHandlers}>
          <MenuOverlay $isOpen={isMenuOpen} onClick={handleOverlayClick} />
          <MenuContainer $isOpen={isMenuOpen}>
            <Menu onClose={closeMenu} />
          </MenuContainer>
          {children}
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={430}>
        <div className="MainLayout small-screen" {...swipeHandlers}>
          <MenuOverlay $isOpen={isMenuOpen} onClick={handleOverlayClick} />
          <MenuContainer $isOpen={isMenuOpen}>
            <Menu onClose={closeMenu} />
          </MenuContainer>
          {children}
        </div>
      </MediaQuery>
    </div>
  );
};

const MenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
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
  height: calc(var(--vh, 1vh) * 100);
  background: #fff;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 20;
`;
