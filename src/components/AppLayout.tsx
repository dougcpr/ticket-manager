import {FC, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import styled from 'styled-components';
import LogOut from "@geist-ui/icons/logOut";
import {Button} from "@geist-ui/core";
import {Inbox, Settings} from "@geist-ui/icons";
import {Session, useSupabaseClient} from "@supabase/auth-helpers-react";
import {AuthChangeEvent} from "@supabase/gotrue-js";
import Home from "@geist-ui/icons/home";

const NavBarContainer = styled.div`
  display: grid;
  grid-template-columns: 4rem 1fr;
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
  grid-template-rows: repeat(4, 4rem);
`

const SideNavBarOperationalButtons = styled.div``

type AppLayoutProps = {
  children: any;
};

const AppLayout: FC<AppLayoutProps> = ({children}) => {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
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
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    await router.push('/')
  }
  if (session) {
    return (
      <NavBarContainer>
        <SideNavBar>
          <SideNavBarButtonContainer>
            <SideNavBarNavigationButtons>
              {/*TODO: MAKE LOOPED TEMPLATE OBJECT */}
              <Button
                onClick={() => router.push('/')} style={{backgroundColor: determineButtonBackgroundColor('/'), border: 0}}
                iconRight={<Home color="#858699"/>}
                auto
                scale={1} />
              <Button
                onClick={() => router.push('/ticket-manager')} style={{backgroundColor: determineButtonBackgroundColor('/ticket-manager'), border: 0}}
                iconRight={<Inbox color="#858699" />}
                auto
                scale={1} />
              <Button
                onClick={() => router.push('/settings')} style={{backgroundColor: determineButtonBackgroundColor('/settings'), border: 0}}
                iconRight={<Settings color="#858699"/>}
                auto
                scale={1} />
            </SideNavBarNavigationButtons>
            <SideNavBarOperationalButtons>
              <Button onClick={signOut} style={{backgroundColor: "transparent", border: 0}} iconRight={<LogOut />} auto scale={1} />
            </SideNavBarOperationalButtons>
          </SideNavBarButtonContainer>
        </SideNavBar>
        {children}
      </NavBarContainer>
    )
  } else {
    return <>{children}</>
  }

};

export default AppLayout;