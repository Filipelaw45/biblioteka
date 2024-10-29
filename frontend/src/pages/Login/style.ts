import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 10px;
`;

export const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 2rem;
  color: ${(props) => props.theme.colors.text};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.primary};
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
`;

export const Input = styled.input`
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;
