import ticketsModel from "../models/ticket.model.js";

export default class TicketDAO {

    async createTicket(ticket) {
        return await ticketsModel.create(ticket);
    }

    async getTicketById(ticketId) {
        return await ticketsModel.findById(ticketId)
    }

    async updateTicket(ticketId, fieldsToUpdate) {
        return await ticketsModel.updateOne({ _id: ticketId }, fieldsToUpdate);
    }

    async deleteTicket(ticketId) {
        return await ticketsModel.deleteOne({ _id: ticketId });
    }
}