import {FC} from 'react';
import {useRouter} from "next/router";
import styled from 'styled-components';
import LogOut from "@geist-ui/icons/logOut";
import {Button} from "@geist-ui/core";
import {supabase} from "@/lib/supabaseClient";
import {Auth} from "@supabase/ui";

const NavBar = styled.div`
    align-items: center;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    height: 4rem;
    margin: 0 2rem;
`;

const NavBarButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 1rem;
`

type AppLayoutProps = {
  children: any;
};

const AppLayout: FC<AppLayoutProps> = ({children}) => {
  const { user } = Auth.useUser()
  const router = useRouter()

  async function signOut() {
    await supabase.auth.signOut()
    await router.push('/')
  }
  if (user) {
    return (
      <>
        <NavBar>
          <h2>Ticket Manager</h2>
          {/*This list is row-reversed to alight to right side,cause past doug was too lazy to find another solution*/}
          <NavBarButtonGroup>
            <Button onClick={signOut} iconRight={<LogOut />} auto scale={2/3} />
          </NavBarButtonGroup>
        </NavBar>
        {children}
      </>
    );
  } else {
    return (
      <>
        {children}
      </>
    )
  }

};

export default AppLayout;