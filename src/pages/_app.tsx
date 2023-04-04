import type { AppProps } from 'next/app'
import {GeistProvider, CssBaseline, Themes} from '@geist-ui/core'
import { supabase } from "@/lib/supabaseClient";
import { Auth } from '@supabase/ui'
import React from "react";
import {GlobalStyles} from "@/lib/global-styles";
import AppLayout from "@/components/AppLayout";

const theme = Themes.createFromDark({
  type: 'darkTheme',
  palette: {
    success: '#000',
  },
})
export default function App({ Component, pageProps }: AppProps) {

  return (
      <Auth.UserContextProvider supabaseClient={supabase}>
        <GeistProvider themes={[theme]} themeType="darkTheme">
          <GlobalStyles />
          <CssBaseline />
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </GeistProvider>
      </Auth.UserContextProvider>
  )

}
