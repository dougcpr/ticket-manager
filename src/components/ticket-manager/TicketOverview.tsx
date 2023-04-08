import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {supabase} from "@/lib/supabaseClient";
import {Ticket} from "@/features/ticket/models";
import {renderDate} from "@/lib/helpers/sharedFunctions";
import TicketsDetails from "@/components/ticket-manager/components/TicketDetails";
import {Circle, CheckInCircle} from '@geist-ui/icons'
import Filter from "@geist-ui/icons/filter";
import {Button, Select, User} from "@geist-ui/core";

const DashCircle = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  border: 2px dashed #818295;
  display: inline-block;
`
const TicketSection = styled.div`
  display: grid;
  grid-template-columns: 25rem 1fr;
  height: 100vh;
  width: 100%;
`

const TicketListContainer = styled.div`
  display: grid;
  grid-template-rows: 3rem 1fr;
  border-right: 1px solid #2a2b39;
  max-width: 25rem;
`

const TicketListRow = styled.div`
  border: 2px solid transparent;
  padding: 1rem;
  display: grid;
  height: 3rem;
  :hover {
    cursor: pointer;
  }
  border-bottom: 1px solid #2a2b39;
`

const TicketListFirstRow = styled.div`
  display: grid;
  grid-template-columns: 15rem 1fr;
`

const TicketListText = styled.div`
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
`

const TicketListSecondRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
`

function returnTicketIcon(status: string | string[]) {
  switch(status) {
    case 'Todo':
      return <DashCircle />
    case 'Closed':
      return <CheckInCircle />
    default:
      return <Circle />
  }
}

function TicketsOverview() {
  const [tickets, setTickets] = useState<Ticket[]>()
  const [selectedTicket, setSelectedTicket] = useState<Ticket>()
  useEffect(() => {
    fetchTicketList()
      .then((res) => {})
  }, [])

  supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'Tickets' },
      async (payload: any) => {
        if (payload.new.id) {
          await fetchTicketList()
        }
      }
    )
    .subscribe()
  supabase.channel('custom-update-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'Tickets' },
      async (payload: any) => {
        if (payload.new.id) {
          await fetchTicketList()
        }
      }
    )
    .subscribe()
  async function fetchTicketList() {
    let { data }: any  = await supabase
      .from('Tickets')
      .select(`
        id,
        title,
        description,
        status,
        created_at,
        assignedTo:Employees!Tickets_assignedTo_fkey(id, name, avatarUrl)
      `)
      .order('created_at')
    if (data) setTickets(data)
  }

  function changeTicketBackground(id: number) {
    const style = {
      borderLeft: "2px solid #575bc7",
      "backgroundColor": "#2a2a3f"
    }
    if (id === selectedTicket?.id) return style
  }

  async function gatherTicketDetails(id: number) {
    let { data }: any  = await supabase
      .from('Tickets')
      .select(`
         id,
         created_at,
         description,
         title,
         status,
         linkedTickets,
         ticketType,
         priority,
         assignedTo:Employees!Tickets_assignedTo_fkey(id, name, avatarUrl),
         TicketActivity(
           id, 
           created_at,
           message,
           author,
           userData:Employees!TicketActivity_userData_fkey(id, name, email, avatarUrl)
         )`)
      .eq('id', id)
      .order('created_at', { ascending: true, nullsFirst: false, foreignTable: 'TicketActivity' })
      .single()
    setSelectedTicket(data)
  }

  return (
    <TicketSection>
      <TicketListContainer>
        <div style={{padding: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          Inbox <Button style={{border: "none"}} auto iconRight={<Filter/>} />
        </div>
        <div>
          {tickets && tickets.map((ticket: Ticket) => {
            return (
              <TicketListRow style={changeTicketBackground(ticket.id)} onClick={() => gatherTicketDetails(ticket.id)} key={ticket.id}>
                <TicketListFirstRow>
                  <TicketListText>{ticket.title}</TicketListText>
                  <div style={{textAlign: "end"}}>{returnTicketIcon(ticket.status)}</div>
                </TicketListFirstRow>
                <TicketListSecondRow>
                  {ticket.assignedTo.avatarUrl && <User src={ticket.assignedTo.avatarUrl} name={ticket.assignedTo.name} />}
                  <div style={{textAlign: "end"}}>{renderDate(ticket.created_at)}</div>
                </TicketListSecondRow>
              </TicketListRow>
            )
          })}
        </div>
      </TicketListContainer>
      <TicketsDetails selectedTicket={selectedTicket}/>
    </TicketSection>
  )
}

export default TicketsOverview