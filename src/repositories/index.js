import CartDAO from "../dao/mongoose/cart.dao.js";
import ProductDAO from "../dao/mongoose/product.dao.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from "./product.repository.js";
import TicketDAO from "../dao/mongoose/ticket.dao.js";
import TicketRepository from "./ticket.repository.js";
import UserRepository from "./user.repository.js";
import UserDAO from "../dao/mongoose/user.dao.js";


export const cartService = new CartRepository(new CartDAO())
export const productService = new ProductRepository(new ProductDAO())
export const ticketService = new TicketRepository(new TicketDAO())
export const userService = new UserRepository(new UserDAO())