import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';

import ArrowPrev from '@/assets/pagination/arrow_back.svg?react';
import ArrowNext from '@/assets/pagination/arrow_next.svg?react';

interface PaginationProps {
  totalPages: number;
}

function Query() {
  return new URLSearchParams(useLocation().search);
}

export const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const query = Query();

  useEffect(() => {
    const getPage = Number(query.get('page'));
    if (getPage) {
      setCurrentPage(getPage);
    } else {
      setCurrentPage(1);
    }
  }, [query]);

  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    query.set('page', page.toString());
    navigate({
      search: query.toString(),
    });
  };

  return (
    <PaginationContainer>
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowPrev />
      </PaginationButton>
      <PaginationText>
        {currentPage}/{totalPages}
      </PaginationText>
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowNext />
      </PaginationButton>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  /* 공통 컴포넌트여서 영향도 조사가 필요합니다 (3/27 목) */
  /* 디자인 QA 상 동일 화면 전체 적용이 필요하다고 하셔서 우선 적용합니다! */
  margin-top: 45px;
`;

const PaginationButton = styled.button`
  color: var(--Color-grayscale-gray900);

  cursor: pointer;

  background-color: transparent;
  border: none;
  style: none;

  &:disabled {
    color: var(--Color-grayscale-gray500);

    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;

const PaginationText = styled.span`
  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  width: 46px;

  padding: var(--Border-Radius-radius_200, 6px)
    var(--Border-Radius-radius_300, 8px);
  margin: 0 10px;

  /* caption/number_large */
  font-family: var(--Typography-family-number, 'Gmarket Sans');
  font-size: 18px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: normal;

  color: #333;
  color: var(--Color-secondary-navy, #1c2231);

  text-align: center;
  letter-spacing: -0.048px;

  background: rgba(248, 249, 250, 0.5);
  border-radius: var(--Border-Radius-radius_circle, 50px);

  backdrop-filter: blur(2px);
`;
