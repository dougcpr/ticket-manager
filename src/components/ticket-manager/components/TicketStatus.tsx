import React from "react";
import styled from "styled-components";
import {Select} from "@geist-ui/core";
import {supabase} from "@/lib/supabaseClient";
import {TicketPriorities} from "@/features/ticket/models";

const TicketStatusContainer = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
`

const TicketStatusHeader = styled.div`
  font-weight: 500;
  line-height: 32px;
  text-transform: uppercase;
`
function TicketStatus({selectedTicket}: any) {

  async function updateTicketData(value: string | string[], column: string, table: string, id: string) {
    let tempObj: any = {};
    tempObj[column] = value;
    const {data, error} = await supabase
      .from(table)
      .update(tempObj)
      .eq('id', id)
  }
  if (selectedTicket?.id) {
    return (
      <TicketStatusContainer>
        <TicketStatusHeader>Ticket Status</TicketStatusHeader>
        <Select value={selectedTicket?.status} onChange={async (value) => {await updateTicketData(value, 'status', 'Tickets', selectedTicket.id)}}>
          <Select.Option value="Todo">Todo</Select.Option>
          <Select.Option value="In Progress">In Progress</Select.Option>
          <Select.Option value="Waiting on Engineering">Waiting on Engineering</Select.Option>
          <Select.Option value="Waiting on Customer">Waiting on Customer</Select.Option>
          <Select.Option value="Done">Done</Select.Option>
        </Select>
        <TicketStatusHeader>Ticket Type</TicketStatusHeader>
        <Select onChange={async (value) => {await updateTicketData(value, 'ticketType', 'TicketMetaData', selectedTicket?.TicketMetaData[0].id)}}  value={selectedTicket?.TicketMetaData[0].ticketType}>
          <Select.Option value="task">Task</Select.Option>
          <Select.Option value="bug">Bug</Select.Option>
          <Select.Option value="improvement">Improvement</Select.Option>
        </Select>
        <TicketStatusHeader>Assigned To</TicketStatusHeader>
        <Select onChange={async (value) => {await updateTicketData(value, 'assignedTo', 'TicketMetaData', selectedTicket?.TicketMetaData[0].id)}}  value={selectedTicket?.TicketMetaData[0].assignedTo}>
        {/*  loop over users*/}
          <Select.Option value="doug.cpr@gmail.com">doug.cpr@gmail.com</Select.Option>
        </Select>
        <TicketStatusHeader>Priority</TicketStatusHeader>
        <Select onChange={async (value) => {await updateTicketData(value, 'priority', 'TicketMetaData', selectedTicket?.TicketMetaData[0].id)}}  value={selectedTicket?.TicketMetaData[0].priority}>
          <Select.Option value={TicketPriorities.Low}>{TicketPriorities.Low}</Select.Option>
          <Select.Option value={TicketPriorities.Medium}>{TicketPriorities.Medium}</Select.Option>
          <Select.Option value={TicketPriorities.High}>{TicketPriorities.High}</Select.Option>
          <Select.Option value={TicketPriorities.Critical}>{TicketPriorities.Critical}</Select.Option>
        </Select>
      </TicketStatusContainer>
    )
  } else {
    return <></>
  }
}

export default TicketStatus