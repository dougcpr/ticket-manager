import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Button, Modal, Table, Text, Input, Spacer} from "@geist-ui/core";
import styled from "styled-components";
import { useFormik } from 'formik';
import LogOut from "@geist-ui/icons/logOut";
import {Ticket, TicketComments} from "@/features/ticket/models";
import {Auth} from "@supabase/ui";

const TicketManagerContainer = styled.div`
    margin: 2rem;
  `

const TicketManagerHeader = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  justify-content: space-between;
  `

const TicketManagerHeaderOperations = styled.div`
  display: flex;
  `


// @ts-ignore
function TicketManager() {
  const { user } = Auth.useUser()
  const [tickets, setTickets] = useState<Ticket[]>()
  const router = useRouter()
  const [state, setState] = useState(false)
  useEffect(() => {
    fetchTickets()
      .then((res) => {console.log(res)})
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
      console.log(values)
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

  const renderDate = (value: string) => {
    const newDate = new Date(value).toLocaleDateString("en-US")
    return <Text>{newDate}</Text>
  }

  async function signOut() {
    await supabase.auth.signOut()
    await router.push('/')
  }


  return (
    <TicketManagerContainer>
      <TicketManagerHeader>
        <h2>Ticket Manager</h2>
        <TicketManagerHeaderOperations>
          <Button onClick={handler}>Create Ticket</Button>
          <Spacer w={1}/>
          <Button
            icon={<LogOut/>}
            onClick={() => signOut()}
          >
            Log out
          </Button>
        </TicketManagerHeaderOperations>
      </TicketManagerHeader>

      <Table data={tickets}>
          <Table.Column prop="title" label="title" />
          <Table.Column prop="status" label="status" />
          <Table.Column prop="assignedUser" label="Assignee" />
          <Table.Column prop="description" label="description" />
          <Table.Column prop="created_at" label="Created At" render={renderDate}/>
          <Table.Column prop="id" label="Operation" render={renderActions}/>
      </Table>

    {/*  Modal  */}
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