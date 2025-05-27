import styled from 'styled-components';

import exportDebugLogImage from '@/assets/debug/export.png';

export const ExportLogButton = () => {
  return (
    <Button
      title="로그 파일 내보내기"
      onClick={() => {
        window.exportSessionLogs();
      }}
    >
      <ExportImage src={exportDebugLogImage} alt="" />
      세션 로그 파일
    </Button>
  );
};

const Button = styled.button`
  position: absolute;
  top: 10px;
  right: calc(50% - 52px);
  z-index: 1000;

  display: flex;

  gap: 4px;
  align-items: center;
  justify-content: center;

  padding: 8px;

  font-size: 12px;

  color: #000;

  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #fafafa;
  }
  &:active {
    background-color: #e0e0e0;
  }
`;

const ExportImage = styled.img`
  width: 14px;
  height: 14px;
`;
