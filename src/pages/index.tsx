import React, {useEffect, useState} from "react";
import {Session, useSupabaseClient} from '@supabase/auth-helpers-react'
import SignIn from "@/pages/sign-in";
import {AuthChangeEvent} from "@supabase/gotrue-js";
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
const Index = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [openTickets, setOpenTickets] = useState([])
  const [closedTickets, setClosedTickets] = useState([])
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

  useEffect(() => {
    fetchOpenTicketList()
    fetchClosedTicketList()
  }, [])

  async function fetchOpenTicketList() {
    let { data }: any  = await supabase
      .from('Tickets')
      .select(`
        status
      `)
      .neq('status', 'Closed')
      .order('created_at')
    if (data) setOpenTickets(data)
  }

  async function fetchClosedTicketList() {
    let { data }: any  = await supabase
      .from('Tickets')
      .select(`
        status
      `)
      .eq('status', 'Closed')
      .order('created_at')
    if (data) setClosedTickets(data)
  }

  const data = [
    {
      name: 'Open',
      amt: openTickets?.length,
    },
    {
      name: 'Closed',
      amt: closedTickets?.length,
    }
  ];

  if (isLoading) return <div />

  return (
    <>
      {!session ? (
        <SignIn setSession={setSession} />
      ) : (
        <div style={{padding: "2rem"}}>
          <ResponsiveContainer width="30%" height="30%">
            <BarChart data={data}>
              <Bar dataKey="amt" fill="#82ca9d" />
              <XAxis dataKey="name" />
              <YAxis dataKey="amt" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  )
}

export default Index
