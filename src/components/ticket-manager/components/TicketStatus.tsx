import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Select} from "@geist-ui/core";
import {supabase} from "@/lib/supabaseClient";
import {Employee, TicketPriorities} from "@/features/ticket/models";
import {PostgrestResponse} from "@supabase/supabase-js";

const TicketStatusContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(6, 5rem);
  background-color: #2a2b39;
  padding: 2rem;
  border-left: 1px solid #26283b;
`

const TicketStatusHeader = styled.div`
  font-weight: 500;
  line-height: 32px;
  text-transform: uppercase;
`
function TicketStatus({selectedTicket}: any) {
  const [users, setUsers] = useState<any>()


  useEffect(() => {
    supabase
      .from("Employees")
      .select("*")
      .then(({data}: PostgrestResponse<any>) => {
        setUsers(data)
      })
  }, [])

  async function updateTicketData(value: string | string[] | number, column: string, id: string) {
    let tempObj: any = {};
    tempObj[column] = value;
    const {data, error} = await supabase
      .from('Tickets')
      .update(tempObj)
      .eq('id', id)
  }
  if (selectedTicket?.id) {
    return (
      <TicketStatusContainer>
        <TicketStatusHeader>Ticket</TicketStatusHeader>
        <Select value={selectedTicket?.status} onChange={async (value) => {await updateTicketData(value, 'status', selectedTicket.id)}}>
          <Select.Option value="Todo">Todo</Select.Option>
          <Select.Option value="In Progress">In Progress</Select.Option>
          <Select.Option value="Waiting on Engineering">Waiting on Engineering</Select.Option>
          <Select.Option value="Waiting on Customer">Waiting on Customer</Select.Option>
          <Select.Option value="Closed">Closed</Select.Option>
        </Select>
        <TicketStatusHeader>Type</TicketStatusHeader>
        <Select onChange={async (value) => {await updateTicketData(value, 'ticketType', selectedTicket?.id)}}  value={selectedTicket?.ticketType}>
          <Select.Option value="task">Task</Select.Option>
          <Select.Option value="bug">Bug</Select.Option>
          <Select.Option value="improvement">Improvement</Select.Option>
        </Select>
        <TicketStatusHeader>Assignee</TicketStatusHeader>
        <Select onChange={async (value) => await updateTicketData(Number(value), 'assignedTo', selectedTicket?.id)} value={selectedTicket?.assignedTo.id.toString()}>
          {users && users.map((user: Employee) => {
            return (
              <Select.Option key={user.id} value={user.id?.toString()}>{user.name}</Select.Option>
            )
          })}
        </Select>
        <TicketStatusHeader>Priority</TicketStatusHeader>
        <Select onChange={async (value) => {await updateTicketData(value, 'priority', selectedTicket?.id)}}  value={selectedTicket?.priority}>
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