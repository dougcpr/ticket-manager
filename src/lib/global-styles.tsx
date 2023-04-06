import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    font-size: 16px;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  body {
    transition: background 0.3s ease-in-out;
    margin: 0;
    padding: 0;
    color: #818295 !important;
}
`