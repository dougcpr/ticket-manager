import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { supabase } from "@/lib/supabaseClient";
import { Auth } from '@supabase/ui'
import React from "react";
import {GlobalStyles} from "@/lib/global-styles";
import {ThemeProvider} from "styled-components";
import AppLayout from "@/components/AppLayout";

export const darkTheme = {
  transition: 0.3,
  body: '#1a1f36',
  text: '#d5d5d5',
  secondaryBackgroundColor: '#f9fafb',
  colors: {
    black: '#000',
    button_disabled: 'rgba(0, 0, 0, 0.26)',
    button_disabled_bg: 'rgba(0, 0, 0, 0.12)',
    button_height: '2.25rem',
    default: '#d5d5d5',
    defaultBackgroundColor: 'white',
    disabled: '#f5f5f5',
    disabled_NavBar_Item: '#8BB7F1',
    fontFamily: 'Roboto, sans-serif',
    green: '#55ad7a',
    blue: '#1e5d88',
    navBarFontColor: '#1a1f36',
    input_border_hover: 'rgba(0,0,0,.87)',
    red: '#FF1654',
    grey: '#e0e0e0',
    white: '#fff',
    font_medium: '1rem',
    width_medium: '12.5rem'
  },
};
export default function App({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider theme={darkTheme}>
      <Auth.UserContextProvider supabaseClient={supabase}>
        <GeistProvider>
          <GlobalStyles />
          <CssBaseline />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </GeistProvider>
      </Auth.UserContextProvider>
    </ThemeProvider>
  )

}
