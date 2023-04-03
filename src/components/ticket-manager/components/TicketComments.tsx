import React from "react";
import styled from "styled-components";
import {Button, Textarea} from "@geist-ui/core";
import {renderDate} from "@/lib/helpers/sharedFunctions";
import {useFormik} from "formik";
import {supabase} from "@/lib/supabaseClient";
import Card from "@/components/core/Card";
import {Ticket, TicketComments} from "@/features/ticket/models";
import {Auth} from "@supabase/ui";
import {PostgrestResponse} from "@supabase/supabase-js";

const TicketCommentsContainer = styled.div``

const TicketNewCommentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-column-gap: 1rem;
`

const TicketCommentsCard = styled.div``

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
function TicketsComments({selectedTicket}: any) {
  const { user } = Auth.useUser()
  function fetchTickets() {
    supabase
      .from('Tickets')
      .select(`
         *,
         TicketComments (*)`)
      .eq('id', selectedTicket.id)
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
              ticket_id: selectedTicket.id,
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
    <TicketCommentsContainer>
      <TicketNewCommentSection>
        <Textarea id="message" name="message" onChange={formik.handleChange} value={formik.values.message} placeholder="Enter a new comment." />
        <Button style={{height: "100%"}} onClick={() => formik.handleSubmit()}>Submit</Button>
      </TicketNewCommentSection>
      <TicketCommentsCard>
        <div>Comments</div>
        <TicketCommentCard>
          {selectedTicket?.TicketComments?.map((comment: TicketComments) => {
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
    </TicketCommentsContainer>
  )
}

export default TicketsComments