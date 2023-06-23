import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {File} from "@geist-ui/icons";
import TicketActivities from "@/components/ticket-manager/components/TicketActivities";
import {Button} from "@geist-ui/core";
import {supabase} from "@/lib/supabaseClient";
import TicketStatus from "@/components/ticket-manager/components/TicketStatus";
import {TextArea} from "@/components/core/TextArea";
import Trash2 from "@geist-ui/icons/trash2";

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
  const [title, setTitle] = useState<string>()
  // TODO: this feels bad
  useEffect(() => {
    setDescription(selectedTicket?.description)
    setTitle(selectedTicket?.title)
  }, [selectedTicket])
  async function submitTicket(value: string, column: string) {
    const newObject: any = {}
    newObject[column] = value
    await supabase
      .from('Tickets')
      .update(newObject)
      .eq('id', selectedTicket.id)
  }

  const deleteTicket = async () => {
    try {
      await supabase
        .from('Tickets')
        .delete()
        .eq('id', selectedTicket?.id)
    } catch (err) {
      console.error(err)
    } finally {}
  }

  if (selectedTicket?.id) {
    return (
      <TicketDetailsContainer>
        <TicketDetailsHeader>
          <File />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <p>HD-{selectedTicket?.id}</p>
            <Button style={{border: "none"}} onClick={deleteTicket} auto iconRight={<Trash2/>} />
          </div>

        </TicketDetailsHeader>
        <TicketDetailsTitle>
          <TextArea
            width="100%"
            onBlur={(e: any) => submitTicket(e.target.value, 'title')}
            onChange={(e: any) => setTitle(e.target.value)}
            id="title"
            name="title"
            value={title}
          >{title}</TextArea>
          <hr/>
        </TicketDetailsTitle>
        <TicketDetailsDescription>
          <TicketHeader>
            Description
          </TicketHeader>
          <TextArea
            width="100%"
            onBlur={(e: any) => submitTicket(e.target.value, 'description')}
            onChange={(e: any) => setDescription(e.target.value)}
            id="description"
            name="description"
            value={description} >{description}</TextArea>
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