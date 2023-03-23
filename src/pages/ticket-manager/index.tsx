import React from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Button, Table} from "@geist-ui/core";

type Ticket = {
  id: number,
  created_at: string,
  description: string,
  title: string
}


// @ts-ignore
function TicketManager({tickets}: Ticket[]) {
  console.log(tickets)
  const router = useRouter()

  const renderAction = (value: number) => {
    const navigateToTicket = () => {
      router.push(`/ticket-manager/ticket/${value}`)
    }
    return (
      <Button auto scale={1/3} font="12px" onClick={navigateToTicket}>Navigate</Button>
    )
  }
  return (
    <>
      <h2>Ticket Manager</h2>
      <Button>Create Ticket</Button>
      <Table data={tickets}>
        {tickets.map((ticket: Ticket) => (
          <>
            <Table.Column key={`${ticket.id}`} prop="id" label="id" />
            <Table.Column key={`${ticket.title}`} prop="title" label="title" render={renderAction}/>
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