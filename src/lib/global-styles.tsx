import { createGlobalStyle } from 'styled-components';

type Theme = {
  theme: {
    transition: number,
    body: string,
    text: string,
    secondaryBackgroundColor: string,
    colors: {
      black: string,
      button_disabled: string,
      button_disabled_bg: string,
      button_height: string,
      default: string,
      defaultBackgroundColor: string,
      disabled: string,
      disabled_NavBar_Item: string,
      fontFamily: string,
      green: string,
      blue: string,
      navBarFontColor: string,
      input_border_hover: string,
      red: string,
      grey: string,
      white: string,
      font_medium: string,
      width_medium: string
    }
  }
}
export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap');
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
    background: ${({ theme }: Theme) => theme.body} !important;
    color: ${({theme}: Theme) => theme.text} !important;
}
`