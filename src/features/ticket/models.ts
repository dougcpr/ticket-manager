export type Ticket = {
  id: number,
  assignedUser: string,
  created_at: string,
  description: string,
  status: string,
  title: string,
  TicketComments: TicketComments[]
}

export type TicketComments = {
  id: number,
  author: string,
  created_at: string,
  deleted: boolean,
  message: string,
  ticket_id: number
}