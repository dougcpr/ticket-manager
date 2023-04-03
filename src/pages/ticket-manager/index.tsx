import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Button, Modal, Table, Text, Input, Spacer, Tabs} from "@geist-ui/core";
import styled from "styled-components";
import { useFormik } from 'formik';
import {Ticket, TicketComments} from "@/features/ticket/models";
import {Auth} from "@supabase/ui";
import {renderDate} from "@/lib/helpers/sharedFunctions";
import TicketsOverview from "@/components/ticket-manager/TicketOverview";

const TicketManagerContainer = styled.div`
  background-color: ${({theme}) => theme.secondaryBackgroundColor};
  border-top-left-radius: 1rem;
`

const TicketManagerHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const TicketManagerTabsContainer = styled.div`
  width: 100%;
  margin-right: 2rem;
`

const TicketManagerActions = styled.div`
  display: flex;
  justify-content: space-between;
`

// @ts-ignore
function TicketManager() {
  const { user } = Auth.useUser()
  const [tickets, setTickets] = useState<Ticket[]>()
  const router = useRouter()
  const [state, setState] = useState(false)
  useEffect(() => {
    fetchTickets()
      .then((res) => {console.log("fetched tickets")})
  }, [])
  async function fetchTickets() {
    let { data } = await supabase
      .from('Tickets')
      .select('*')
    if (data) setTickets(data)
  }

  const handler = () => setState(true)
  const closeHandler = () => {
    setState(false)
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'Todo',
      assignedUser: user?.email
    },
    onSubmit: async (values: Partial<Ticket>) => {
      setState(false)

      try {
        await supabase
          .from('Tickets')
          .insert([
            values,
          ])
        await fetchTickets()
      } catch (err) {
        console.error(err)
      } finally {}
      formik.handleReset({})
    },
  });

  const renderDateWithText = (value: string | undefined) => {
    return <Text>{renderDate(value)}</Text>
  }

  const renderActions = (value: string | number | TicketComments[], rowData: Ticket, index: number) => {
    const navigateToTicket = () => {
      router.push(`/ticket-manager/ticket/${value}`)
    }
    const deleteTicket = async () => {
      try {
        // delete ticket comments first
        await supabase
          .from('TicketComments')
          .delete()
          .eq('ticket_id', value)
        // then delete ticket
        await supabase
          .from('Tickets')
          .delete()
          .eq('id', value)
        // remove ticket from table data source without re-fetching
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
  if (user) {
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
          <TicketManagerTabsContainer>
            <Tabs initialValue="1">
              <Tabs.Item label="Open Tickets" value="1">
                <TicketsOverview status={null}/>
              </Tabs.Item>
              <Tabs.Item label="Closed Tickets" value="2">
                <TicketsOverview status="Closed"/>
              </Tabs.Item>
            </Tabs>
          </TicketManagerTabsContainer>
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

}

export async function getServerSideProps({ req } : any) {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (!user) {
    // If no user, redirect to index.
    return { props: {}, redirect: { destination: '/', permanent: false } }
  }

  // If there is a user, return it.
  // TODO: Fix. Feels Bad
  return { props: { user } }

}

export default TicketManager