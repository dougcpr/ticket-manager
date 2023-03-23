import React from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Button, Table, Text} from "@geist-ui/core";

type Ticket = {
  id: number,
  created_at: string,
  description: string,
  title: string
}


// @ts-ignore
function TicketManager({tickets}: Ticket[]) {
  const router = useRouter()

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
  return (
    <>
      <h2>Ticket Manager</h2>
      <Button>Create Ticket</Button>
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

    </>
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