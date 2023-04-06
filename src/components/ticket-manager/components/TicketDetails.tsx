import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {File} from "@geist-ui/icons";
import TicketActivities from "@/components/ticket-manager/components/TicketActivities";
import {Select, Textarea} from "@geist-ui/core";
import {useFormik} from "formik";
import {supabase} from "@/lib/supabaseClient";
import {Employee, TicketPriorities} from "@/features/ticket/models";
import {PostgrestResponse} from "@supabase/supabase-js";
import TicketStatus from "@/components/ticket-manager/components/TicketStatus";

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

const TicketHeader = styled.div`
  font-weight: 500;
  line-height: 32px;
  text-transform: uppercase;
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
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <TicketDetailsHeader>
            <File />
            <p>HD-{selectedTicket?.id}</p>
          </TicketDetailsHeader>
          <div>Reported By: {selectedTicket.reportedBy.name}</div>
        </div>
        <TicketDetailsTitle>
          <h3>{selectedTicket.title}</h3>
          <hr/>
        </TicketDetailsTitle>
        <TicketDetailsDescription>
          <TicketHeader>
            Description
          </TicketHeader>
          <Textarea
            width="100%"
            onBlur={submitTicket}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            name="description"
            value={description} />
        </TicketDetailsDescription>
        <TicketStatus selectedTicket={selectedTicket}/>
        <TicketActivities selectedTicket={selectedTicket}/>
      </TicketDetailsContainer>
    )
  } else {
    return (
      <TicketDetailsContainer />
    )
  }
}

export default TicketsDetails