import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Ticket, TicketComments} from "@/features/ticket/models";
import {PostgrestResponse} from "@supabase/supabase-js";
import {Button, Textarea} from "@geist-ui/core";
import {useFormik} from "formik";
import {Auth} from "@supabase/ui";
import {ParsedUrlQuery} from "querystring";
import styled from "styled-components";
import Card from "@/components/core/Card";
import {renderDate} from "@/lib/helpers/sharedFunctions";

const TicketOverviewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 15rem 7rem 40rem;
  grid-row-gap: 1rem;
  width: 60%;
  margin: 3rem 20%;
`

const TicketOverviewDetailsCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 1rem;
`

const TicketOverviewCard = styled(Card)`
  
`
const TicketNewCommentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-column-gap: 1rem;
`

const TicketCommentsCard = styled(Card)`
  overflow: scroll;
`

const TicketCommentCard = styled.div`
  display: grid;
  grid-row-gap: 1rem;
`

const TicketComment = styled(Card)`
  display: grid;
  grid-template-rows: 1fr 0.1fr;
  grid-row-gap: 2rem;
  grid-template-columns: 1fr;
`

const TicketCommentFooter = styled.div`
  display: flex;
  justify-content: space-between;
`

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
      .order('created_at', { ascending: false, nullsFirst: false, foreignTable: 'TicketComments' })
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
          <TicketOverviewContainer>
              <TicketOverviewCard>
                  <h1>Ticket Details</h1>
                  <TicketOverviewDetailsCard>
                      <div>Title: {ticket.title}</div>
                      <div>Description: {ticket.description}</div>
                      <div>Status: {ticket.status}</div>
                      <div>Assignee: {ticket.assignedUser}</div>
                      <div>Created: {renderDate(ticket.created_at)}</div>
                  </TicketOverviewDetailsCard>
              </TicketOverviewCard>
              <TicketNewCommentSection>
                  <Textarea id="message" name="message" onChange={formik.handleChange} value={formik.values.message} placeholder="Enter a new comment." />
                  <Button style={{height: "100%"}} onClick={() => formik.handleSubmit()}>Submit</Button>
              </TicketNewCommentSection>
              <TicketCommentsCard>
                  <h1>Comments</h1>
                  <TicketCommentCard>
                    {ticket?.TicketComments?.map((comment) => {
                      return (
                        <TicketComment key={comment.id}>

                          <div key={comment.message}>Message: {comment.message}</div>
                          <TicketCommentFooter>
                            <div key={comment.author}>Author: {comment.author}</div>
                            <div key={comment.created_at}>Created: {renderDate(comment.created_at)}</div>
                          </TicketCommentFooter>
                        </TicketComment>
                      )
                    })}
                  </TicketCommentCard>
              </TicketCommentsCard>
          </TicketOverviewContainer>
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