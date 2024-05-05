import { getLogger } from "../utils/logger.js"

const logger = getLogger()

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
            logger.info("Ticket created successfully!")
        } catch (error) {
            logger.fatal("Error creating a ticket")
            throw error
        }
    }
}