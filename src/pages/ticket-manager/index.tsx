import React from "react";
import Link from "next/link";
import {supabase} from "@/lib/supabaseClient";

type Ticket = {
  id: number,
  created_at: string,
  description: string,
  title: string
}

// @ts-ignore
function TicketManager({tickets}: Ticket[]) {
  console.log(tickets);
  return (
    <>
      <h2>Ticket Manager</h2>
      {tickets.map((ticket: Ticket) => (
        <div key={`${ticket.id}`}>
          <Link href={`/ticket-manager/ticket/${ticket.id}`}>{ticket.title}</Link>
        </div>
        )
      )}

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