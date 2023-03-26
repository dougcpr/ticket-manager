import React, { useEffect } from "react";
import useSWR from 'swr'
import { Auth } from '@supabase/ui'
import {supabase} from "@/lib/supabaseClient";
import {useRouter} from "next/router";

// pages
import SignIn from "@/pages/sign-in";

// @ts-ignore
const fetcher = ([url, token]) =>
  fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
  }).then((res) => res.json())

const Index = () => {
  const router = useRouter()
  const { user, session } = Auth.useUser()
  const { data, error } = useSWR(
    session ? ['/api/getUser', session.access_token] : null,
    fetcher
  )

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Send session to /api/auth route to set the auth cookie.
        // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
        fetch('/api/auth', {
          method: 'POST',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin',
          body: JSON.stringify({ event, session }),
        }).then((res) => res.json())
      }
    )

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) {
      router.push('/ticket-manager')
    }
  }, [user])

  const View = () => {
    if (!user) {
      return (
        <SignIn />
      )
    } else {
      return (
        <>Loading...</>
      )
    }
  }
  return (
    <View />
  )
}

export default Index
