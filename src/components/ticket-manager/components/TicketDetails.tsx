import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {File} from "@geist-ui/icons";
import TicketActivities from "@/components/ticket-manager/components/TicketActivities";
import {Textarea} from "@geist-ui/core";
import {useFormik} from "formik";
import {supabase} from "@/lib/supabaseClient";

const TicketDetailsContainer = styled.div`
  min-height: 1rem;
  padding: 2rem;
  color: white;
`

const TicketDetailsHeader = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
  align-items: center;
`

const TicketDetailsTitle = styled.div``

const TicketDetailsDescription = styled.div``

const TicketDetailsDescriptionHeader = styled.div`
  font-weight: bold;
  padding: 1rem 0;
`
function TicketsDetails({selectedTicket}: any) {
  const [description, setDescription] = useState<string>()
  // TODO: this feels bad
  useEffect(() => {
    setDescription(selectedTicket?.description)
  }, [selectedTicket])
  async function submitTicket() {
    await supabase
      .from('Tickets')
      .update({ description })
      .eq('id', selectedTicket.id)
  }

  if (selectedTicket?.id) {
    return (
      <TicketDetailsContainer>
        <TicketDetailsHeader>
          <File />
          <p>HD-{selectedTicket?.id}</p>
        </TicketDetailsHeader>
        <TicketDetailsTitle>
          <h3>{selectedTicket.title}</h3>
          <hr/>
        </TicketDetailsTitle>
        Reported By: {selectedTicket.reportedBy.name}
        <TicketDetailsDescription>
          <TicketDetailsDescriptionHeader>
            Description
          </TicketDetailsDescriptionHeader>
          <Textarea width={100}
                    onBlur={submitTicket}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    name="description"
                    value={description} />
          <TicketActivities selectedTicket={selectedTicket}/>
        </TicketDetailsDescription>
      </TicketDetailsContainer>
    )
  } else {
    return (
      <TicketDetailsContainer />
    )
  }
}

export default TicketsDetails