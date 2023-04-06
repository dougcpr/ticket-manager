import React, {FC, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import styled from 'styled-components';
import LogOut from "@geist-ui/icons/logOut";
import {Button, Input, Modal, Spacer} from "@geist-ui/core";
import {Inbox, Settings} from "@geist-ui/icons";
import {Session, useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {AuthChangeEvent} from "@supabase/gotrue-js";
import Home from "@geist-ui/icons/home";
import Plus from "@geist-ui/icons/plus";
import {useFormik} from "formik";
import {Ticket, TicketPriorities} from "@/features/ticket/models";

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

type AppLayoutProps = {
  children: any;
};

const AppLayout: FC<AppLayoutProps> = ({children}) => {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [state, setState] = useState(false)
  const user = useUser()

  const handler = () => setState(true)
  const closeHandler = () => {
    setState(false)
  }
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
                <Button
                  onClick={() => router.push('/settings')} style={{backgroundColor: determineButtonBackgroundColor('/settings'), border: 0}}
                  icon={<Settings color="#858699"/>}
                  auto
                  scale={1}>Settings</Button>
              </SideNavBarNavigationButtons>
              <SideNavBarOperationalButtons>
                <Button onClick={signOut} style={{backgroundColor: "transparent", border: 0}} icon={<LogOut />} auto scale={1}>Logout</Button>
              </SideNavBarOperationalButtons>
            </SideNavBarButtonContainer>
          </SideNavBar>
          {children}
        </NavBarContainer>
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
      </>
    )
  } else {
    return <>{children}</>
  }

};

export default AppLayout;