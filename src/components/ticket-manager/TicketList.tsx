import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {supabase} from "@/lib/supabaseClient";
import {Ticket} from "@/features/ticket/models";
import {renderDate} from "@/lib/helpers/sharedFunctions";

const TicketSection = styled.div`
  color: black;
  display: grid;
  grid-template-columns: 2fr 6fr 2fr;
`

const TicketListContainer = styled.div`
  display: grid;
  grid-template-rows: 2rem 1fr;
`

const TicketListHeader = styled.div`
  padding-left: 0.5rem;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
`

const TicketListItem = styled.div`
  padding: 0.5rem 0rem;
  font-weight: bold;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  height: 3rem;
  width: 100%;
  :hover {
    background-color: ${({theme}) => theme.body};
    color: white;
    cursor: pointer;
  }
`

const TicketDetailsContainer = styled.div`
  background-color: blue;
  width: 100%;
  height: 1rem;
`

const TicketDetailsHeader = styled.div``

const TicketDetailsDescription = styled.div``

const TicketDetailsLinkedTickets = styled.div``

const TicketDetailsAttachments = styled.div``

const TicketStatusSideMenu = styled.div`
  background-color: red;
  width: 100%;
  height: 1rem;
`

const TicketStatusTicketStatus = styled.div``

const TicketStatusTicketHistory = styled.div``

function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>()
  useEffect(() => {
    fetchTickets()
      .then((res) => {console.log("fetched tickets")})
  }, [])
  async function fetchTickets() {
    let { data } = await supabase
      .from('Tickets')
      .select('*')
    if (data) setTickets(data)
  }
  return (
    <TicketSection>
      <TicketListContainer>
        <TicketListHeader>
          <div>Ticket Name</div>
          <div>Created At</div>
        </TicketListHeader>
        {/*  loop over tickets */}
        {/*  create ticket cell item */}
        {/*  on click, it should load ticket details to the right*/}
        {tickets && tickets.map((ticket: Ticket) => {
          return (
            <TicketListItem key={ticket.id}>
                <div style={{paddingLeft: "0.5rem"}}>{ticket.title}</div>
                <div style={{fontWeight: "normal", textAlign: "end", paddingRight: "0.5rem"}}>{renderDate(ticket.created_at)}</div>
            </TicketListItem>
          )
        })}
      </TicketListContainer>
      <TicketDetailsContainer />
      <TicketStatusSideMenu />
    </TicketSection>
  )
}

export default TicketList