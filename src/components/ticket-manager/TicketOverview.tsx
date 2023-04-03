import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {supabase} from "@/lib/supabaseClient";
import {Ticket} from "@/features/ticket/models";
import {renderDate} from "@/lib/helpers/sharedFunctions";
import TicketsDetails from "@/components/ticket-manager/components/TicketDetails";
import TicketStatus from "@/components/ticket-manager/components/TicketStatus";

const TicketSection = styled.div`
  color: black;
  display: grid;
  grid-template-columns: 2fr 6fr 2fr;
  height: 90vh;
`

const TicketListContainer = styled.div`
  border-right: 1px solid #e3e8ee;
`

const TicketListHeader = styled.div`
  padding-left: 0.5rem;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
`

const TicketListItem = styled.div`
  padding: 0.5rem 0;
  font-weight: bold;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  height: 3rem;
  width: 100%;
  :hover {
    background-color: ${({theme}) => theme.colors.onHover};
    cursor: pointer;
  }
`

function TicketsOverview({status}: any) {
  const [tickets, setTickets] = useState<Ticket[]>()
  const [selectedTicket, setSelectedTicket] = useState<Ticket>()
  useEffect(() => {
    fetchTicketList()
      .then((res) => {})
  }, [])
  async function fetchTicketList() {
    if (status !== null) {
      let { data } = await supabase
        .from('Tickets')
        .select(`*`)
        .eq('status', status)
        .order('created_at')
      if (data) setTickets(data)
    } else {
      let { data } = await supabase
        .from('Tickets')
        .select(`*`)
        .neq('status', "Closed")
        .order('created_at')
      if (data) setTickets(data)
    }
  }

  function changeTicketBackground(id: number) {
    if (id === selectedTicket?.id) return '#A9C8F1FF'
  }

  async function gatherTicketDetails(id: number) {
    let { data } = await supabase
      .from('Tickets')
      .select(`
         *,
         TicketMetaData (*),
         TicketComments(*)`)
      .eq('id', id)
      .order('created_at', { ascending: true, nullsFirst: false, foreignTable: 'TicketComments' })
      .single()
    setSelectedTicket(data)
  }

  return (
    <TicketSection>
      <TicketListContainer>
        <TicketListHeader>
          <div>Ticket Name</div>
          <div>Created At</div>
        </TicketListHeader>
        {tickets && tickets.map((ticket: Ticket) => {
          return (
            <TicketListItem style={{backgroundColor: changeTicketBackground(ticket.id)}} onClick={() => gatherTicketDetails(ticket.id)} key={ticket.id}>
                <div style={{paddingLeft: "0.5rem"}}>{ticket.title}</div>
                <div style={{fontWeight: "normal", textAlign: "end", paddingRight: "0.5rem"}}>{renderDate(ticket.created_at)}</div>
            </TicketListItem>
          )
        })}
      </TicketListContainer>
      <TicketsDetails selectedTicket={selectedTicket}/>
      <TicketStatus selectedTicket={selectedTicket}/>
    </TicketSection>
  )
}

export default TicketsOverview