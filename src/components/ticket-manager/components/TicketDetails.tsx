import React from "react";
import styled from "styled-components";
import {File} from "@geist-ui/icons";
import TicketDetailsTable from "@/components/ticket-manager/components/TicketDetailsTable";

const TicketDetailsContainer = styled.div`
  min-height: 1rem;
  padding: 2rem;
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
function TicketsDetails({selectedTicket}: any) {
  if (selectedTicket?.id) {
    return (
      <TicketDetailsContainer>
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
          <TicketDetailsTable tableData={selectedTicket}/>
        </TicketDetailsDescription>
      </TicketDetailsContainer>
    )
  } else {
    return (
      <TicketDetailsContainer />
    )
  }
}

export default TicketsDetails