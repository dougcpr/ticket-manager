import React, {useEffect, useState} from "react";
import {Session, useSupabaseClient} from '@supabase/auth-helpers-react'
import SignIn from "@/pages/sign-in";
import {AuthChangeEvent} from "@supabase/gotrue-js";
const Index = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setLoading] = useState(true)
  const supabase = useSupabaseClient()
  useEffect(() => {
    supabase?.auth?.getSession().then(({ data: { session} }: any ) => {
      setSession(session)
    })
    const {
      data: { subscription },
    } = supabase?.auth?.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) return <div />

  return (
    <>
      {!session ? (
        <SignIn setSession={setSession} />
      ) : (
        <>Welcome to your account.</>
      )}
    </>
  )
}

export default Index
