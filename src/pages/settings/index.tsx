import React from "react";
import styled from "styled-components";

const SettingsContainer = styled.div`
  background-color: ${({theme}) => theme.secondaryBackgroundColor};
  padding: 2rem;
  border-top-left-radius: 1rem;
`

function Settings() {
  return (
    <SettingsContainer>
      <div>
        Hello Settings
      </div>
    </SettingsContainer>
  )
}

export default Settings