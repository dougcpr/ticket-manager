export type Ticket = {
  id: number,
  assignedUser: string,
  created_at: string,
  description: string,
  status: string,
  title: string,
  reportedBy: string,
  TicketComments: TicketComments[]
  TicketMetaData: TicketMetaData[]
}

export type TicketComments = {
  id: number,
  author: string,
  created_at: string,
  deleted: boolean,
  message: string,
  ticket_id: number
}

export type TicketMetaData = {
  id: number,
  reportedBy: string,
  created_at: string,
  laptopType: boolean,
  linkedTickets: number[],
  ticket_id: number,
  assignedTo: string,
  priority: string
}