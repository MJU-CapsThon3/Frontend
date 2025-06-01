import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Wrapper = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
`;

const Button = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ffd972;
  border: 2px solid #ffcc00;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px solid #000;
`;

const Indicator = styled.span`
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
`;

interface Props {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<Props> = ({ page, totalPages, onPrev, onNext }) => (
  <Wrapper>
    <Button onClick={onPrev}>
      <FaChevronLeft />
    </Button>
    <Indicator>
      {page} / {totalPages}
    </Indicator>
    <Button onClick={onNext}>
      <FaChevronRight />
    </Button>
  </Wrapper>
);

export default Pagination;
