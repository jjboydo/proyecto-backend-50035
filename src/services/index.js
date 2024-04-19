import CartDAO from "../dao/mongoose/CartDAO.js";
import ProductDAO from "../dao/mongoose/ProductDAO.js";
import CartService from "./cartServices.js";
import ProductService from "./productServices.js";


export const cartService = new CartService(new CartDAO())
export const productService = new ProductService(new ProductDAO())