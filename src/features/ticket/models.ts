export type Ticket = {
  id: number,
  assignedUser: string,
  created_at: string,
  description: string,
  status: string,
  title: string,
  comments: TicketComments[]
}

export type TicketComments = {
  id: number,
  message: string,
  created_at: string,
  author: string,
  deleted: boolean
}