import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Button, Textarea, User} from "@geist-ui/core";
import {useFormik} from "formik";
import {supabase} from "@/lib/supabaseClient";
import {Employee, TicketActivity} from "@/features/ticket/models";
import {PostgrestResponse} from "@supabase/supabase-js";
import moment from "moment";
import {useUser} from "@supabase/auth-helpers-react";

const TicketNewCommentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.1fr;
  grid-column-gap: 1rem;
`

const TicketHeader = styled.div`
  font-weight: 500;
  line-height: 32px;
  text-transform: uppercase;
`

const TicketActivityCard = styled.div``

const TicketActivityContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
`

const TicketComment = styled.div`
  background-color: #1f2130;
  padding: 1rem;
  color: white;
  display: grid;
  grid-row-gap: 0.5rem;
`

const TicketCommentAuthorRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 6rem 1fr;
`

function TicketActivities({selectedTicket}: any) {
  const [ticket, setTicketData] = useState(selectedTicket)
  const [userData, setUserData] = useState<Employee>()
  const user = useUser()

  useEffect(() => {
    setTicketData(selectedTicket)
  }, [selectedTicket])

  useEffect(() => {
    fetchUser()
  }, [])

  type UnitOfTime = {
    unit: string,
    limit: number
  }

  const unitsOfTime: UnitOfTime[] = [
    { unit: 'minute', limit: 60},
    { unit: 'hour', limit: 24},
    { unit: 'day', limit: 7},
    { unit: 'week', limit: 3},
    { unit: 'month', limit: 999}
  ];


  function calculateTimeSinceNow(date: string | undefined) {
    let timeCalculated = false
    let timeSince = 0 as string | number
    const now = moment(Date.now())
    unitsOfTime.forEach((unitOfTime: UnitOfTime) => {
      if (timeCalculated) return
      // @ts-ignore
      timeSince = now.diff(moment(date), unitOfTime.unit);
      if (timeSince > unitOfTime.limit) {
        return
      } else {
        timeCalculated = true;
        timeSince = `${timeSince} ${timeSince <= 1 ? unitOfTime.unit : unitOfTime.unit + 's'} ago`
      }
    });
    return timeSince
  }
  function fetchUser() {
    supabase
      .from('Employees')
      .select(`*`)
      .eq('email', user?.email)
      .then(({data}: PostgrestResponse<any>) => {
        if (data) {
          setUserData(data[0])
        }
      })
  }
  function fetchTickets() {
    supabase
      .from('Tickets')
      .select(`
         *,
         TicketActivity(
           id, 
           created_at,
           message,
           author,
           userData:Employees!TicketActivity_userData_fkey(id, name, email, avatarUrl)
         )`)
      .eq('id', ticket.id)
      .order('created_at', { ascending: true, nullsFirst: false, foreignTable: 'TicketActivity' })
      .then(({data}: PostgrestResponse<any>) => {
        if (data) {
          setTicketData(data[0])
        }
      })
  }
  const formik = useFormik({
    initialValues: {
      message: ''
    },
    onSubmit: async (values: Partial<TicketActivity>) => {
      try {
        await supabase.from('TicketActivity')
          .insert([
            {
              ticketId: ticket.id,
              author: userData?.name,
              message: values.message,
              userData: userData?.id
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
      <TicketActivityCard>
        <TicketHeader>Activity</TicketHeader>
        <TicketActivityContainer>
          {ticket?.TicketActivity.length ? ticket?.TicketActivity?.map((comment: TicketActivity) => {
            return (
              <TicketComment key={comment.id}>
                <TicketCommentAuthorRow><User src={userData?.avatarUrl} name={userData?.name} /> <span style={{color: '#818295', fontSize: "0.85rem"}}>{calculateTimeSinceNow(comment.created_at)}</span></TicketCommentAuthorRow>
                <div>{comment.message}</div>
              </TicketComment>
            )
          }) : <>No Comments.</>}
          <TicketNewCommentSection>
            <Textarea style={{backgroundColor: '#1f2130'}} id="message" name="message" onChange={formik.handleChange} value={formik.values.message} placeholder="Leave a comment..." />
            <Button type="success" style={{height: "100%"}} onClick={() => formik.handleSubmit()}>Comment</Button>
          </TicketNewCommentSection>
        </TicketActivityContainer>
      </TicketActivityCard>
    </>
  )
}

export default TicketActivities