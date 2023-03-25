import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { supabase } from "@/lib/supabaseClient";
import { Auth } from '@supabase/ui'
import React from "react";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <GeistProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </GeistProvider>
    </Auth.UserContextProvider>
  )

}
