import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
`;

export const ReservationList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
`;

export const ReservationItem = styled.li`
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 5px;
  width: 100%;
`;

export const CancelButton = styled.button`
  margin-top: 8px;
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;
