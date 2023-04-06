import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
// import {supabase} from "@/lib/supabaseClient";
import {Button, Modal, Text, Input, Spacer} from "@geist-ui/core";
import styled from "styled-components";
import { useFormik } from 'formik';
import {Ticket, TicketActivity, TicketPriorities} from "@/features/ticket/models";
import {Auth} from "@supabase/ui";
import {renderDate} from "@/lib/helpers/sharedFunctions";
import TicketsOverview from "@/components/ticket-manager/TicketOverview";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {GetServerSidePropsContext} from "next";
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

const TicketManagerContainer = styled.div`
  background-color: ${({theme}) => theme.secondaryBackgroundColor};
  border-top-left-radius: 1rem;
`

const TicketManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

// @ts-ignore
function TicketManager() {
  const [tickets, setTickets] = useState<Ticket[]>()
  const router = useRouter()
  const [state, setState] = useState(false)
  const supabase = useSupabaseClient()

  const renderActions = (value: string | number | TicketActivity[], rowData: Ticket, index: number) => {
    const navigateToTicket = () => {
      router.push(`/ticket-manager/ticket/${value}`)
    }
    const deleteTicket = async () => {
      try {
        await supabase
          .from('Tickets')
          .delete()
          .eq('id', value)
        setTickets((last: Ticket[] | null | undefined) => last?.filter((_: Ticket, dataIndex: number) => dataIndex !== index))
      } catch (err) {
        console.error(err)
      } finally {}
    }
    return (
      <>
        <Button type="success" auto scale={1/2} font="0.75rem" onClick={navigateToTicket}>Navigate</Button>
        <Spacer w={2}/>
        <Button type="error" auto scale={1/2} font="0.75rem" onClick={deleteTicket}>Delete</Button>
      </>

    )
  }
    return (
      <TicketManagerContainer>
        <TicketManagerHeader>
          <TicketsOverview/>
        </TicketManagerHeader>
      </TicketManagerContainer>
    )
}

export default TicketManager