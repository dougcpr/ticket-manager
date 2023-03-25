import React, {useState} from "react";
import {useRouter} from "next/router";
import {supabase} from "@/lib/supabaseClient";
import {Button, Modal, Table, Text, Input, ButtonGroup, Spacer} from "@geist-ui/core";
import styled from "styled-components";
import { useFormik } from 'formik';
import {Http2ServerRequest} from "http2";
import {IncomingMessage} from "http";

type Ticket = {
  id: number,
  created_at: string,
  description: string,
  title: string
}

const TicketManagerContainer = styled.div`
    margin: 2rem;
  `

const TicketManagerHeader = styled.div`
    display: flex;
    justify-content: space-between;
  `


// @ts-ignore
function TicketManager({data}: Ticket[]) {
  const [tickets, setTickets] = useState(data)
  const router = useRouter()
  const [state, setState] = useState(false)
  const handler = () => setState(true)
  const closeHandler = () => {
    setState(false)
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: ''
    },
    onSubmit: async (values: Partial<Ticket>) => {
      console.log(values)
      setState(false)

      try {
        const { data, error } = await supabase
          .from('Tickets')
          .insert([
            values,
          ])
        // TODO: Fetch data again?
      } catch (err) {
        console.error(err)
      } finally {}
      formik.handleReset({})
    },
  });

  const renderActions = (value: string | number, rowData: Ticket, index: number) => {
    const navigateToTicket = () => {
      router.push(`/ticket-manager/ticket/${value}`)
    }
    const deleteTicket = async () => {
      try {
        const { data, error } = await supabase
          .from('Tickets')
          .delete()
          .eq('id', value)
        // remove ticket from table data source without re-fetching
        setTickets((last: Ticket[]) => last.filter((_: any, dataIndex: number) => dataIndex !== index))

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


  return (
    <TicketManagerContainer>
      <TicketManagerHeader>
        <h2>Ticket Manager</h2>
        <Button onClick={handler}>Create Ticket</Button>
      </TicketManagerHeader>

      <Table data={tickets}>
          <Table.Column prop="title" label="title" />
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

  let { data, error } = await supabase
    .from('Tickets')
    .select('*')

  // If there is a user, return it.
  // TODO: Fix. Feels Bad
  return { props: { user , data} }

}

export default TicketManager