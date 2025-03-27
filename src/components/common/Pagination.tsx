import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ArrowPrev from "../../../public/assets/pagination/arrow_back.svg?react";
import ArrowNext from "../../../public/assets/pagination/arrow_next.svg?react";

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
    const getPage = Number(query.get("page"));
    if (getPage) {
      setCurrentPage(getPage);
    } else {
      setCurrentPage(1);
    }
  }, [query]);

  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    query.set("page", page.toString());
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
  justify-content: center;
  align-items: center;

  // 공통 컴포넌트여서 영향도 조사가 필요합니다 (3/27 목)
  // 디자인 QA 상 동일 화면 전체 적용이 필요하다고 하셔서 우선 적용합니다!
  margin-top: 45px;
`;

const PaginationButton = styled.button`
  background-color: transparent;
  border: none;
  style: none;
  cursor: pointer;
  color: var(--Color-grayscale-gray900);

  &:disabled {
    color: var(--Color-grayscale-gray500);
    cursor: not-allowed;
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
  padding: var(--Border-Radius-radius_200, 6px)
    var(--Border-Radius-radius_300, 8px);
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: var(--Border-Radius-radius_circle, 50px);
  background: rgba(248, 249, 250, 0.5);
  backdrop-filter: blur(2px);
  color: var(--Color-secondary-navy, #1c2231);
  text-align: center;

  /* caption/number_large */
  font-family: var(--Typography-family-number, "Gmarket Sans");
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.048px;
`;
