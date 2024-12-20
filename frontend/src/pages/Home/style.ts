import styled from 'styled-components';

interface BooksProps {
  isEven: boolean;
}

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
`;

export const Books = styled.div<BooksProps>`
  text-align: left;
  width: 80%;
  padding: 20px;
  border-radius: 5px;
  margin: 5px 0;

  background: ${(props) => (props.isEven ? props.theme.colors.even : props.theme.colors.odd)};

  button {
    padding: 5px 10px;
    cursor: pointer;
    border: none;
    background-color: green;
    color: #f5f5f5;

    &:disabled {
      background-color: gray;
      cursor: default;
    }
  }
`;

export const Search = styled.div`
  margin: 15px;
  input {
    margin: 0 10px;
    padding: 5px;
    font-size: 1rem;
  }

  select {
    padding: 5px;
    font-size: 1rem;
  }
`;
