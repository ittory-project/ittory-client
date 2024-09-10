import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
    const getPage = Number(query.get("page"))
    if (getPage) {
      setCurrentPage(getPage)
    } else {
      setCurrentPage(1)
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
      <PaginationButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <img src='/assets/arrow_back_black.svg' />
      </PaginationButton>
      <PaginationText>{currentPage}/{totalPages}</PaginationText>
      <PaginationButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <img src='/assets/arrow_next_black.svg' />
      </PaginationButton>
    </PaginationContainer>
  );
};

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const PaginationButton = styled.button`
  background-color: transparent;
  border: none;
  style: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active {
    color: #000;
  }

  &:focus {
    outline: none;
  }
`;

const PaginationText = styled.span`
  width: 46px;
  margin: 0 10px;
  font-size: 18px;
  color: #333;
  display: flex;
  padding: var(--Border-Radius-radius_200, 6px) var(--Border-Radius-radius_300, 8px);
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: rgba(248, 249, 250, 0.50);
  backdrop-filter: blur(2px);
  color: var(--Color-secondary-navy, #1C2231);
  text-align: center;

  /* caption/number_large */
  font-family: var(--Typography-family-number, "Gmarket Sans");
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.048px;
`;
