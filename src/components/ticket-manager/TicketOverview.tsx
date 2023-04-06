import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {supabase} from "@/lib/supabaseClient";
import {Ticket} from "@/features/ticket/models";
import {renderDate} from "@/lib/helpers/sharedFunctions";
import TicketsDetails from "@/components/ticket-manager/components/TicketDetails";
import TicketStatus from "@/components/ticket-manager/components/TicketStatus";
import {Circle, CheckInCircle, Sidebar} from '@geist-ui/icons'
import {Button, Drawer} from "@geist-ui/core";

const DashCircle = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  border: 2px dashed #818295;
  display: inline-block;
`
const TicketSection = styled.div`
  display: grid;
  grid-template-columns: 25rem 1fr 25rem;
  height: 100vh;
  width: 100%;
`

const TicketListContainer = styled.div`
  border-right: 1px solid #2a2b39;
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

const RightSidebar = styled(Sidebar)`
  transform: rotate(180deg);
`

function returnTicketIcon(status: string) {
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
  async function fetchTicketList() {
    let { data } = await supabase
      .from('Tickets')
      .select(`*`)
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
    let { data } = await supabase
      .from('Tickets')
      .select(`
         *,
         TicketMetaData (*),
         TicketActivity(*)`)
      .eq('id', id)
      .order('created_at', { ascending: true, nullsFirst: false, foreignTable: 'TicketActivity' })
      .single()
    setSelectedTicket(data)
  }

  return (
    <TicketSection>
      <TicketListContainer>
        {tickets && tickets.map((ticket: Ticket) => {
          return (
            <TicketListRow style={changeTicketBackground(ticket.id)} onClick={() => gatherTicketDetails(ticket.id)} key={ticket.id}>
              <TicketListFirstRow>
                <TicketListText>{ticket.title}</TicketListText>
                <div style={{textAlign: "end"}}>{returnTicketIcon(ticket.status)}</div>
              </TicketListFirstRow>
              <TicketListSecondRow>
                <div/>
                <div style={{textAlign: "end"}}>{renderDate(ticket.created_at)}</div>
              </TicketListSecondRow>
            </TicketListRow>
          )
        })}
      </TicketListContainer>
      <TicketsDetails selectedTicket={selectedTicket}/>
      <TicketStatus selectedTicket={selectedTicket}/>
    </TicketSection>
  )
}

export default TicketsOverview