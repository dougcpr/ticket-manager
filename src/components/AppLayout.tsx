import {FC} from 'react';
import {useRouter} from "next/router";
import styled from 'styled-components';
import LogOut from "@geist-ui/icons/logOut";
import {Button, Spacer} from "@geist-ui/core";
import {supabase} from "@/lib/supabaseClient";
import {Inbox, Settings} from "@geist-ui/icons";

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
  const router = useRouter()

  function determineButtonBackgroundColor(path: string) {
    if (router.pathname === path) {
      return "#272832"
    } else {
      return "transparent"
    }
  }
  async function signOut() {
    await supabase.auth.signOut()
    await router.push('/')
  }
    return (
      <NavBarContainer>
        <SideNavBar>
          <SideNavBarButtonContainer>
            <SideNavBarNavigationButtons>
              {/*TODO: MAKE LOOPED TEMPLATE OBJECT */}
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

};

export default AppLayout;