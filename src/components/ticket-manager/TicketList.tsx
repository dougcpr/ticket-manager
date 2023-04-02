import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {supabase} from "@/lib/supabaseClient";
import {Ticket} from "@/features/ticket/models";
import {renderDate} from "@/lib/helpers/sharedFunctions";
import {File} from "@geist-ui/icons";

const TicketSection = styled.div`
  color: black;
  display: grid;
  grid-template-columns: 2fr 6fr 2fr;
`

const TicketListContainer = styled.div`
  display: grid;
  grid-template-rows: 2rem repeat(10, 1fr);
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

const TicketDetailsContainer = styled.div`
  padding: 2rem;
  display: grid;
  grid-template-rows: 4rem 4rem 1fr 1fr 1fr;
`

const TicketDetailsHeader = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: center;
`

const TicketDetailsTitle = styled.div``

const TicketDetailsDescription = styled.div``

const TicketDetailsDescriptionHeader = styled.div`
  font-weight: bold;
  padding: 1rem 0;
`

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
  const [selectedTicket, setSelectedTicket] = useState<Ticket>()
  useEffect(() => {
    fetchTickets()
      .then((res) => {console.log("fetched tickets")})
  }, [])
  async function fetchTickets() {
    let { data } = await supabase
      .from('Tickets')
      .select(`
         *,
         TicketComments (*),
         TicketMetaData (*)`)
      .neq('status', 'Closed')
      .order('created_at', { ascending: false, nullsFirst: false, foreignTable: 'TicketComments' })
    if (data) setTickets(data)
  }

  function clickedTicket(id: number) {
    if (id === selectedTicket?.id) return '#A9C8F1FF'
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
            <TicketListItem style={{backgroundColor: clickedTicket(ticket.id)}} onClick={() => setSelectedTicket(ticket)} key={ticket.id}>
                <div style={{paddingLeft: "0.5rem"}}>{ticket.title}</div>
                <div style={{fontWeight: "normal", textAlign: "end", paddingRight: "0.5rem"}}>{renderDate(ticket.created_at)}</div>
            </TicketListItem>
          )
        })}
      </TicketListContainer>
      {selectedTicket?.id && <TicketDetailsContainer>
        <TicketDetailsHeader>
            <File />
            <p>HD-{selectedTicket?.id}</p>
        </TicketDetailsHeader>
        <TicketDetailsTitle>
            <h3>{selectedTicket.title}</h3>
            <hr/>
        </TicketDetailsTitle>
        <TicketDetailsDescription>
            <TicketDetailsDescriptionHeader>
                Description
            </TicketDetailsDescriptionHeader>
            <div>
              {selectedTicket.description}
            </div>
            <TicketDetailsDescriptionHeader>
                Information collected for this ticket
            </TicketDetailsDescriptionHeader>
            <div>
              Name: {selectedTicket.reportedBy}
            </div>
        </TicketDetailsDescription>
      </TicketDetailsContainer>}
      {!selectedTicket?.id && <TicketDetailsContainer />}
      <TicketStatusSideMenu />
    </TicketSection>
  )
}

export default TicketList