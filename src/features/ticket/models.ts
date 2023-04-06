export type Ticket = {
  id: number,
  created_at: string,
  description: string,
  status: string,
  title: string,
  reportedBy: string | undefined,
  assignedTo: string,
  priority: TicketPriorities,
  linkedTickets?: number[],
  ticketType: string
  TicketActivity: TicketActivity[]

}

export type TicketActivity = {
  id?: number,
  author: string,
  created_at?: string,
  message: string,
  ticket_id: number
}

export enum TicketPriorities {
  "Low"="Low",
  "Medium"="Medium",
  "High"="High",
  "Critical"="Critical"
}

export type Employee = {
  id?: number,
  name: string,
  email: string
}