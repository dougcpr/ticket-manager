import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { supabase } from "@/lib/supabaseClient";
import { Auth } from '@supabase/ui'
import React from "react";
import {GlobalStyles} from "@/lib/global-styles";
import {ThemeProvider} from "styled-components";
import AppLayout from "@/components/AppLayout";

const theme = {
  body: '#1a1f36',
  text: 'white',
  colors: {
    black: '#000',
    button_disabled: 'rgba(0, 0, 0, 0.26)',
    button_disabled_bg: 'rgba(0, 0, 0, 0.12)',
    button_height: '2.25rem',
    default: '#1a1f36',
    onHover: '#A9C8F1FF',
    defaultBackgroundColor: 'white',
    disabled: '#f5f5f5',
    disabled_NavBar_Item: '#a9c8f1',
    fontFamily: 'Roboto, sans-serif',
    green: '#55ad7a',
    blue: '#1e5d88',
    grey: '#e0e0e0',
    navBarFontColor: '#1a1f36',
    input_border_hover: 'rgba(0,0,0,.87)',
    red: '#FF1654',
    white: '#fff',
    font_medium: '1rem',
    width_medium: '12.5rem'
  },
};
export default function App({ Component, pageProps }: AppProps) {

  return (
    <ThemeProvider theme={theme}>
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
