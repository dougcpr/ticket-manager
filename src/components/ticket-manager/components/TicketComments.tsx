import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button, Textarea} from "@geist-ui/core";
import {useFormik} from "formik";
import {supabase} from "@/lib/supabaseClient";
import {Ticket, TicketComments} from "@/features/ticket/models";
import {Auth} from "@supabase/ui";
import {PostgrestResponse} from "@supabase/supabase-js";
import moment from "moment";

const TicketNewCommentSection = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-column-gap: 1rem;
`

const TicketCommentHeader = styled.div`
  font-weight: bold;
  padding: 1rem 0;
`

const TicketCommentsCard = styled.div``

const TicketCommentsContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  display: grid;
  grid-gap: 1rem;
  padding: 1rem;
  max-height: 40vh;
  overflow-y: scroll;
`

const TicketComment = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
`

const TicketCommentFooter = styled.div`
  font-size: 0.75rem;
  font-style: italic;
  color: black;
`
function TicketsComments({selectedTicket}: any) {
  const { user } = Auth.useUser()
  const [ticket, setTicketData] = useState(selectedTicket)

  useEffect(() => {
    setTicketData(selectedTicket)
  }, [selectedTicket])

  function calculateCommentStyles(email: string) {
    const style = {
      width: "fit-content",
      backgroundColor: '',
      padding: "0.25rem",
      borderRadius: "0.25rem"
    }
    style.backgroundColor = email === user?.email ? 'rgba(10, 132, 255, 1)' : 'rgba(44, 44, 46, 1)'
    return style
  }
  function calculateCommentOrientation(email: string) {
    return email === user?.email ? 'flex-end' : 'flex-start'
  }
  function fetchTickets() {
    supabase
      .from('Tickets')
      .select(`
         *,
         TicketComments (*)`)
      .eq('id', ticket.id)
      .order('created_at', { ascending: true, nullsFirst: false, foreignTable: 'TicketComments' })
      .then(({data}: PostgrestResponse<Ticket>) => {
        console.log('new data', data)
        if (data) {
          setTicketData(data[0])
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
              authorEmail: user?.email,
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
      <TicketCommentsCard>
        <TicketCommentHeader>Comments</TicketCommentHeader>
        <TicketCommentsContainer>
          {ticket?.TicketComments.length ? ticket?.TicketComments?.map((comment: TicketComments) => {
            return (
              <TicketComment style={{alignItems: calculateCommentOrientation(comment.authorEmail)}} key={comment.id}>
                <div style={calculateCommentStyles(comment.authorEmail)} key={comment.message}>{comment.message}</div>
                <TicketCommentFooter>{moment(comment.created_at).format("MM/DD, h:mm:ss a")}</TicketCommentFooter>
              </TicketComment>
            )
          }) : <>No Comments.</>}
        </TicketCommentsContainer>
        <TicketNewCommentSection>
          <Textarea id="message" name="message" onChange={formik.handleChange} value={formik.values.message} placeholder="Enter a new comment." />
          <Button style={{height: "100%"}} onClick={() => formik.handleSubmit()}>Submit</Button>
        </TicketNewCommentSection>
      </TicketCommentsCard>
    </>
  )
}

export default TicketsComments