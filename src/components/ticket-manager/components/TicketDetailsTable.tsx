import React, {FC} from "react";
import styled from "styled-components";
import {Ticket} from "@/features/ticket/models";


const TicketDetailsCollectedTable = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr;
`

const TicketDetailsCollectedRow = styled.div`
  :nth-child(2) {
    border-right: 1px solid black;
  }
`

const TicketDetailsCollectedCell = styled.div`
  border-left: 1px solid black;
  border-top: 1px solid black;
  :last-child{
    border-bottom: 1px solid black;
  }
  padding: 1rem;
`

function TicketDetailsTable({tableData}: any) {
  return (
    <TicketDetailsCollectedTable>
        <TicketDetailsCollectedRow>
            <TicketDetailsCollectedCell>Name</TicketDetailsCollectedCell>
            <TicketDetailsCollectedCell>Laptop Type</TicketDetailsCollectedCell>
        </TicketDetailsCollectedRow>
        <TicketDetailsCollectedRow>
            <TicketDetailsCollectedCell>{tableData.TicketMetaData[0].reportedBy}</TicketDetailsCollectedCell>
            <TicketDetailsCollectedCell>{tableData.TicketMetaData[0].laptopType}</TicketDetailsCollectedCell>
        </TicketDetailsCollectedRow>
    </TicketDetailsCollectedTable>
  )
}

export default TicketDetailsTable