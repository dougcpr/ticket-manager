import React, {FC, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import styled from 'styled-components';
import LogOut from "@geist-ui/icons/logOut";
import {Button, Modal, Select} from "@geist-ui/core";
import {Inbox, Settings} from "@geist-ui/icons";
import {Session, useSupabaseClient} from "@supabase/auth-helpers-react";
import {AuthChangeEvent} from "@supabase/gotrue-js";
import Home from "@geist-ui/icons/home";
import Plus from "@geist-ui/icons/plus";
import {useFormik} from "formik";
import {Employee, Ticket, TicketPriorities} from "@/features/ticket/models";
import {PostgrestResponse} from "@supabase/supabase-js";
import {TextArea} from "@/components/core/TextArea";

const NavBarContainer = styled.div`
  display: grid;
  grid-template-columns: 10rem 1fr;
`

const SideNavBar = styled.div`
  border-right: 1px solid #2a2b39;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const SideNavBarButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const SideNavBarNavigationButtons = styled.div`
  display: grid;
  grid-row-gap: 1rem;
  padding-top: 3rem;
`

const SideNavBarOperationalButtons = styled.div`
  padding-bottom: 3rem;
`

const CreateTicketSelect = styled(Select)`
  background-color: #323343;
  color: #908fab;
`

type AppLayoutProps = {
  children: any;
};

const AppLayout: FC<AppLayoutProps> = ({children}) => {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [state, setState] = useState(false)
  const [users, setUsers] = useState<any>()

  const handler = () => setState(true)
  const closeHandler = () => {
    setState(false)
  }
  useEffect(() => {
    supabase
      .from("Employees")
      .select("*")
      .then(({data}: PostgrestResponse<any>) => {
        setUsers(data)
      })
  }, [])
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
  function determineButtonBackgroundColor(path: string) {
    if (router.pathname === path) {
      return "#272832"
    } else {
      return "transparent"
    }
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'Todo',
      linkedTickets: [],
      priority: TicketPriorities.Low,
      assignedTo: 3,
      ticketType: 'task'
    },
    onSubmit: async (values: Partial<Ticket>) => {
      try {
        const {data} = await supabase
          .from('Tickets')
          .insert([
            values,
          ])
      } catch (err) {
        console.error(err)
      } finally {}
      setState(false)
      formik.handleReset({})
    },
  });
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    await router.push('/')
  }
  if (session) {
    return (
      <>
        <NavBarContainer>
          <SideNavBar>
            <SideNavBarButtonContainer>
              <SideNavBarNavigationButtons>
                {/*TODO: MAKE LOOPED TEMPLATE OBJECT */}
                <Button icon={<Plus color="#858699"/>} onClick={handler} auto scale={1} style={{border: 0}} >New Ticket</Button>
                <Button
                  onClick={() => router.push('/')} style={{backgroundColor: determineButtonBackgroundColor('/'), border: 0}}
                  icon={<Home color="#858699"/>}
                  auto
                  scale={1}>Home</Button>
                <Button
                  onClick={() => router.push('/ticket-manager')} style={{backgroundColor: determineButtonBackgroundColor('/ticket-manager'), border: 0}}
                  icon={<Inbox color="#858699" />}
                  auto
                  scale={1} >Inbox</Button>
              </SideNavBarNavigationButtons>
              <SideNavBarOperationalButtons>
                <Button onClick={signOut} style={{backgroundColor: "transparent", border: 0}} icon={<LogOut />} auto scale={1}>Logout</Button>
              </SideNavBarOperationalButtons>
            </SideNavBarButtonContainer>
          </SideNavBar>
          {children}
        </NavBarContainer>
        <Modal width={2} visible={state} onClose={() => {closeHandler(); formik.resetForm();}}>
          <Modal.Title>Create Ticket</Modal.Title>
          <Modal.Content>
            <form style={{display: "grid", gridTemplateRows: "1fr 1fr 1fr", gridRowGap: "1rem"}}>
              <TextArea id="title" name="title" placeholder="Ticket title" onChange={formik.handleChange} value={formik.values.title}/>
              <TextArea id="description" name="description" placeholder="Add description..." onChange={formik.handleChange} value={formik.values.description}/>
              <div style={{display: 'grid', gridTemplateColumns: "repeat(4, 1fr)", gridColumnGap: "0.5rem"}}>
                <CreateTicketSelect pure={true} value={formik.values.status} onChange={(v: string | string[]) => formik.values.status = v}>
                  <Select.Option value="Todo">Todo</Select.Option>
                  <Select.Option value="In Progress">In Progress</Select.Option>
                  <Select.Option value="Waiting on Engineering">Waiting on Engineering</Select.Option>
                  <Select.Option value="Waiting on Customer">Waiting on Customer</Select.Option>
                  <Select.Option value="Closed">Closed</Select.Option>
                </CreateTicketSelect>
                <CreateTicketSelect pure={true} placeholder="Priority" onChange={(v: any) => formik.values.priority = v} value={formik.values.priority}>
                  <Select.Option value={TicketPriorities.Low}>{TicketPriorities.Low}</Select.Option>
                  <Select.Option value={TicketPriorities.Medium}>{TicketPriorities.Medium}</Select.Option>
                  <Select.Option value={TicketPriorities.High}>{TicketPriorities.High}</Select.Option>
                  <Select.Option value={TicketPriorities.Critical}>{TicketPriorities.Critical}</Select.Option>
                </CreateTicketSelect>
                <CreateTicketSelect pure={true} placeholder="Type" onChange={(v: string | string[]) => formik.values.ticketType = v} value={formik.values.ticketType}>
                  <Select.Option value="task">Task</Select.Option>
                  <Select.Option value="bug">Bug</Select.Option>
                  <Select.Option value="improvement">Improvement</Select.Option>
                </CreateTicketSelect>
                <CreateTicketSelect pure={true} placeholder="Assignee" onChange={(v: any) => formik.values.assignedTo = v} value={formik.values.assignedTo?.toString()}>
                  {users && users.map((user: Employee) => {
                    return (
                      <Select.Option key={user.id} value={user.id?.toString()}>{user.name}</Select.Option>
                    )
                  })}
                </CreateTicketSelect>
              </div>
            </form>
          </Modal.Content>
          <Modal.Action passive onClick={() => setState(false)}>Cancel</Modal.Action>
          <Modal.Action onClick={() => formik.handleSubmit()}>Submit</Modal.Action>
        </Modal>
      </>
    )
  } else {
    return <>{children}</>
  }

};

export default AppLayout;