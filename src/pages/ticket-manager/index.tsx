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
  const user = useUser()
  // useEffect(() => {
  //   fetchTickets()
  //     .then((res) => {})
  // }, [])
  // async function fetchTickets() {
  //   let { data } = await supabase
  //     .from('Tickets')
  //     .select('*')
  //   if (data) setTickets(data)
  // }

  const handler = () => setState(true)
  const closeHandler = () => {
    setState(false)
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'Todo',
      TicketMetaData: {
        laptopType: '',
        reportedBy: user?.email,
        ticket_id: 0,
        assignedTo: '',
        ticketType: '',
        priority: TicketPriorities.Low
      },
    },
    onSubmit: async (values: Partial<Ticket>) => {
      setState(false)

      try {
        const {data} = await supabase
          .from('Tickets')
          .insert([
            values,
          ])
        // TODO: Fix as next action item
        // if (data?.id) {
        //   values.TicketMetaData.ticket_id = data.id;
        //   await supabase
        //     .from('TicketMetaData')
        //     .insert([values.TicketMetaData])
        //   await fetchTickets()
        // }
      } catch (err) {
        console.error(err)
      } finally {}
      formik.handleReset({})
    },
  });

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
  // TODO: Awful practice
    return (
      // <TicketManagerContainer>
      //   <TicketManagerHeader>
      //     <Button onClick={handler}>Create Ticket</Button>
      //   </TicketManagerHeader>
      //   <Table data={tickets}>
      //       <Table.Column prop="title" label="title" />
      //       <Table.Column prop="status" label="status" />
      //       <Table.Column prop="assignedUser" label="Assignee" />
      //       <Table.Column prop="description" label="description" />
      //       <Table.Column prop="created_at" label="Created At" render={renderDateWithText}/>
      //       <Table.Column prop="id" label="Operation" render={renderActions}/>
      //   </Table>
      //
      //
      // </TicketManagerContainer>
      <TicketManagerContainer>
        <TicketManagerHeader>
          <TicketsOverview/>
          {/*<TicketManagerActions>*/}
          {/*  /!*Create this as a FAB icon*!/*/}
          {/*  <Button icon={<Plus />} onClick={handler}>Create Ticket</Button>*/}
          {/*</TicketManagerActions>*/}
        </TicketManagerHeader>
        <div>
          <Modal visible={state} onClose={closeHandler}>
            <Modal.Title>Create Ticket</Modal.Title>
            <Modal.Content>
              <form>
                <Input id="title" name="title" label="Name" placeholder="" onChange={formik.handleChange} value={formik.values.title}/>
                <Spacer h={2}/>
                <Input id="description" name="description" label="Description" placeholder="" onChange={formik.handleChange} value={formik.values.description}/>
              </form>
            </Modal.Content>
            <Modal.Action passive onClick={() => setState(false)}>Cancel</Modal.Action>
            <Modal.Action onClick={() => formik.handleSubmit()}>Submit</Modal.Action>
          </Modal>
        </div>
      </TicketManagerContainer>
    )
}

export default TicketManager