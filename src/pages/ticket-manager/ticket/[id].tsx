import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Ticket, TicketComments} from "@/features/ticket/models";
import {PostgrestResponse} from "@supabase/supabase-js";
import {Button, Textarea} from "@geist-ui/core";
import {useFormik} from "formik";
import {Auth} from "@supabase/ui";
import {ParsedUrlQuery} from "querystring";
function TicketOverview() {
  const { user } = Auth.useUser()
  const [ticket, setTicket] = useState<Partial<Ticket>>({})
  const router = useRouter()
  const {id}: ParsedUrlQuery = router.query;
  useEffect(() => {
    try {
      fetchTickets()
    } catch (e) {
      console.error(e)
    }
  }, [])

  function fetchTickets() {
    supabase
      .from('Tickets')
      .select(`
         *,
         TicketComments (*)`)
      .eq('id', id)
      .then(({data}: PostgrestResponse<Ticket>) => {
        if (data) {
          // @ts-ignore
          setTicket(data[0])
        }
      })
  }

  const formik = useFormik({
    initialValues: {
      message: ''
    },
    onSubmit: async (values: Partial<TicketComments>) => {
      try {
        await supabase.from('TicketComments')
          .insert([
            {
              ticket_id: ticket.id,
              author: user?.email,
              message: values.message
            }
          ])
        fetchTickets()
      } catch (err) {
        console.error(err)
      } finally {}
      formik.handleReset({})
    },
  });

  return (
    <>
      {ticket &&
          <>
              <h1>Ticket Details</h1>
              <div>
                  <div>{ticket.title}</div>
                  <div>{ticket.description}</div>
                  <div>{ticket.status}</div>
                  <div>{ticket.assignedUser}</div>
                  <div>{ticket.created_at}</div>
              </div>
              <h1>Comments</h1>
              <Textarea id="message" name="message" onChange={formik.handleChange} value={formik.values.message} placeholder="Enter a new comment." />
              <Button onClick={() => formik.handleSubmit()}>Submit Comment</Button>
              <div>
                {ticket?.TicketComments?.map((comment) => {
                  return (
                    <div key={comment.id}>
                      <div key={comment.message}>{comment.message}</div>
                      <div key={comment.author}>Author: {comment.author}</div>
                      <div key={comment.created_at}>Author: {comment.created_at}</div>
                    </div>
                  )
                })}
              </div>
          </>
      }
      {!ticket &&
          <div>Loading...</div>
      }

    </>
  )
}

export async function getServerSideProps({ req } : any) {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } }
  }
  return {props: {}}
}

export default TicketOverview