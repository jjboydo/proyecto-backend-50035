export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createTicket(ticket) {
        try {
            await this.dao.createTicket({
                amount: ticket.amount,
                purchaser: ticket.purchaser
            })
            console.log("Ticket creado correctamente!")
        } catch (error) {
            throw error
        }
    }
}