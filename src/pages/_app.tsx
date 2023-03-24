import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline, Button } from '@geist-ui/core'
import {supabase} from "@/lib/supabaseClient";

async function signOut() {
  const { error } = await supabase.auth.signOut()
}
export default function App({ Component, pageProps }: AppProps) {
  return (
      <GeistProvider>
        <CssBaseline />
        {/*Provide error context*/}
        <Button onClick={() => signOut()}>Sign Out</Button>
        <Component {...pageProps} />
      </GeistProvider>
    )

}
