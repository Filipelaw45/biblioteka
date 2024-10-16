import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-size: 14px;
        color: ${(props) => props.theme.colors.text};
        background-color: ${(props) => props.theme.colors.background};
        font-family: 'Poppins', sans-serif;
        transition: background-color 0.3s, color 0.3s;
    }
`;
