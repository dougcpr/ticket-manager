import {FC} from 'react';
import {useRouter} from "next/router";
import styled from 'styled-components';
import LogOut from "@geist-ui/icons/logOut";
import {Button, Input, Spacer} from "@geist-ui/core";
import {supabase} from "@/lib/supabaseClient";
import {Auth} from "@supabase/ui";
import {Archive, Inbox, Settings} from "@geist-ui/icons";

const NavBar = styled.div`
  color: white;
  background-color: #1a1f36;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 4rem;
`;

const AppContainer = styled.div`
  background-color: ${({theme}) => theme.body};
  display: grid;
  grid-template-rows: 4rem 1fr;
`

const NavBarContainer = styled.div`
  display: grid;
  grid-template-columns: 4rem 1fr;
`

const SideNavBar = styled.div`
  background-color: #1a1f36;
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
  const { user } = Auth.useUser()
  const router = useRouter()

  function determineButtonBackgroundColor(path: string) {
    if (router.pathname === path) {
      return "white"
    } else {
      return "transparent"
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    await router.push('/')
  }
  if (user) {
    return (
      <div>
        <NavBarContainer>
          <SideNavBar>
            <Spacer h={7}/>
            <SideNavBarButtonContainer>
              <SideNavBarNavigationButtons>
                {/*TODO: MAKE LOOPED TEMPLATE OBJECT */}
                <Button onClick={() => router.push('/ticket-manager')} style={{backgroundColor: determineButtonBackgroundColor('/ticket-manager'), border: 0}} iconRight={<Inbox />} auto scale={1} />
                <Button onClick={() => router.push('/archive')} style={{backgroundColor: determineButtonBackgroundColor('/archive'), border: 0}} iconRight={<Archive />} auto scale={1} />
                <Button onClick={() => router.push('/settings')} style={{backgroundColor: determineButtonBackgroundColor('/settings'), border: 0}} iconRight={<Settings />} auto scale={1} />
              </SideNavBarNavigationButtons>
              <SideNavBarOperationalButtons>
                <Button onClick={signOut} style={{backgroundColor: "transparent", border: 0}} iconRight={<LogOut />} auto scale={1} />
              </SideNavBarOperationalButtons>
            </SideNavBarButtonContainer>
            <Spacer h={3}/>
          </SideNavBar>
          <AppContainer>
            <NavBar>
              <h2>Help Desk</h2>
            </NavBar>
            {children}
          </AppContainer>
        </NavBarContainer>
      </div>
    );
  } else {
    return (
      <div>
        {children}
      </div>
    )
  }

};

export default AppLayout;