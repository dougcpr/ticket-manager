import React, {useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Button, Modal, Table, Text, Input} from "@geist-ui/core";
import styled from "styled-components";

type Ticket = {
  id: number,
  created_at: string,
  description: string,
  title: string
}


// @ts-ignore
function TicketManager({tickets}: Ticket[]) {
  const router = useRouter()
  const [state, setState] = useState(false)
  const handler = () => setState(true)
  const closeHandler = () => {
    setState(false)
  }

  const newTicket = {
    name: '',
    description: ''
  }

  const renderAction = (value: number) => {
    const navigateToTicket = () => {
      router.push(`/ticket-manager/ticket/${value}`)
    }
    return (
      <Button auto scale={1/3} font="0.75rem" onClick={navigateToTicket}>Navigate</Button>
    )
  }

  const renderDate = (value: string) => {
    const newDate = new Date(value).toLocaleDateString("en-US")
    return <Text>{newDate}</Text>
  }

  const TicketManagerContainer = styled.div`
    margin: 2rem;
  `

  const TicketManagerHeader = styled.div`
    display: flex;
    justify-content: space-between;
  `

  return (
    <TicketManagerContainer>
      <TicketManagerHeader>
        <h2>Ticket Manager</h2>
        <Button onClick={handler}>Create Ticket</Button>
      </TicketManagerHeader>

      <Table data={tickets}>
        {tickets.map((ticket: Ticket) => (
          <>
            <Table.Column key={`${ticket.title}`} prop="title" label="title" />
            <Table.Column key={`${ticket.description}`} prop="description" label="description" />
            <Table.Column key={`${ticket.created_at}`} prop="created_at" label="Created At" render={renderDate}/>
            <Table.Column key={`${ticket.id}+${ticket.title}`} prop="id" label="Operation" render={renderAction}/>
          </>
          )
        )}
      </Table>

    {/*  Modal  */}
      <div>
        <Modal visible={state} onClose={closeHandler}>
          <Modal.Title>Modal</Modal.Title>
          <Modal.Subtitle>This is a modal</Modal.Subtitle>
          <Modal.Content>
            <Input label="Name" placeholder="" />
            <Input label="Description" placeholder="" />
          </Modal.Content>
          <Modal.Action passive onClick={() => setState(false)}>Cancel</Modal.Action>
          <Modal.Action>Submit</Modal.Action>
        </Modal>
      </div>

    </TicketManagerContainer>
  )
}

export async function getServerSideProps() {


  let { data, error } = await supabase
    .from('Tickets')
    .select('*')


  return {
    props: {
      tickets: data
    },
  }
}

export default TicketManager