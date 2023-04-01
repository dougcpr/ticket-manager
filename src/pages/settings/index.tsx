import React from "react";
import {supabase} from "@/lib/supabaseClient";
import styled from "styled-components";

// TODO: Make a Layout
const SettingsContainer = styled.div`
  background-color: ${({theme}) => theme.secondaryBackgroundColor};
  padding: 2rem;
  border-top-left-radius: 1rem;
`

function Settings() {
  return (
    <SettingsContainer>
      <div style={{color: "black"}}>
        Hello Settings
      </div>
    </SettingsContainer>
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

export default Settings