export type Ticket = {
  id: number,
  created_at: string,
  description: string,
  status: string | string[],
  title: string,
  assignedTo: number,
  priority: TicketPriorities,
  linkedTickets?: number[],
  ticketType: string | string[]
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