import styled from 'styled-components';

export const ImageButton = styled.button`
  box-sizing: content-box;
  display: inline-flex;

  align-items: center;
  justify-content: center;

  background: none;
  border: none;

  /* NOTE: 키보드 네비게이션 시에만 outline 표시 */
  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: auto;
  }
`;

ImageButton.defaultProps = {
  type: 'button',
};
