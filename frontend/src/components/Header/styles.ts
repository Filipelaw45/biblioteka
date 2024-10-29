import styled from 'styled-components';

export const Container = styled.header`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text};;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 30px;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  :first-child() {
    color: ${(props) => props.theme.colors.text};
  }
`;

export const Logo = styled.h1`
  font-size: 1.6rem;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text};
`;

export const Button = styled.button`
  width: 50px;
  height: 35px;
  background-color: white;
  color: black;
  padding: 3px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
