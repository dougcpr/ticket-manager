import type { AppProps } from 'next/app'
import {GeistProvider, CssBaseline, Themes} from '@geist-ui/core'
import {SessionContextProvider} from '@supabase/auth-helpers-react'
import React from "react";
import {supabase} from "@/lib/supabaseClient";
import {GlobalStyles} from "@/lib/global-styles";
import AppLayout from "@/components/AppLayout";

const theme = Themes.createFromDark({
  type: 'darkTheme',
  palette: {
    background: '#191a23',
    success: '#292a35'
  },
})
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
        <GeistProvider themes={[theme]} themeType="darkTheme">
          <GlobalStyles />
          <CssBaseline />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </GeistProvider>
    </SessionContextProvider>
  )

}
