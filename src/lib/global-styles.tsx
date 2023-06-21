import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html {
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
  body {
    overflow-y: hidden;
    height: 99vh;
    border: 1px solid transparent;
    transition: background 0.3s ease-in-out;
    margin: 0;
    padding: 0;
    color: #818295 !important;
}
`