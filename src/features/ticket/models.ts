export type Ticket = {
  id: number,
  created_at: string,
  description: string,
  status: string,
  title: string,
  TicketComments: TicketComments[]
  TicketMetaData: TicketMetaData
}

export type TicketComments = {
  id?: number,
  authorEmail: string,
  created_at?: string,
  message: string,
  ticket_id: number
}

export type TicketMetaData = {
  id?: number,
  reportedBy: string | undefined,
  created_at?: string,
  laptopType: string,
  linkedTickets?: number[],
  ticket_id: number,
  assignedTo: string,
  priority: TicketPriorities,
  ticketType: string
}

export enum TicketPriorities {
  "Low"="Low",
  "Medium"="Medium",
  "High"="High",
  "Critical"="Critical"
}