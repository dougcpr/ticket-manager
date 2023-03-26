import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Ticket} from "@/features/ticket/models";
import {PostgrestResponse} from "@supabase/supabase-js";
import {Button, Textarea} from "@geist-ui/core";

function TicketOverview() {
  const [ticket, setTicket] = useState<Partial<Ticket>>({})
  const router = useRouter()
  const {id} = router.query;
  useEffect(() => {
    try {
      supabase
        .from('Tickets')
        .select('*')
        .eq('id', id)
        .then(({data}: PostgrestResponse<Ticket>) => {
          console.log(data)
          // @ts-ignore
          setTicket(data[0])
        })
    } catch (e) {
      console.error(e)
    }
  }, [])

  function submitComment() {

  }

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
              <Textarea placeholder="Enter a new comment." />
              <Button onClick={() => submitComment()}>Submit Comment</Button>
              <div>
                {ticket?.comments?.map((comment) => {
                  return (
                    <div key={comment.id}>
                      <div key={comment.message}>{comment.message}</div>
                      <div key={comment.author}>Author: {comment.author}</div>
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