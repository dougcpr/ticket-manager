import React from "react";
import styled from "styled-components";
import TicketsOverview from "@/components/ticket-manager/TicketOverview";

const TicketManagerContainer = styled.div`
  background-color: ${({theme}) => theme.secondaryBackgroundColor};
  border-top-left-radius: 1rem;
`

const TicketManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

function TicketManager() {
    return (
      <TicketManagerContainer>
        <TicketManagerHeader>
          <TicketsOverview/>
        </TicketManagerHeader>
      </TicketManagerContainer>
    )
}

export default TicketManager