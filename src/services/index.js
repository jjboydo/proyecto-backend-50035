import CartDAO from "../dao/mongoose/CartDAO.js";
import ProductDAO from "../dao/mongoose/ProductDAO.js";
import CartService from "./cartServices.js";
import ProductService from "./productServices.js";
import TicketDAO from "../dao/mongoose/ticketDAO.js";
import TicketService from "./ticketService.js";


export const cartService = new CartService(new CartDAO())
export const productService = new ProductService(new ProductDAO())
export const ticketService = new TicketService(new TicketDAO())