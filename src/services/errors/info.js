export const generateUserErrorInfo = (user) => {
    return `Una o más propiedades estaban incompletas o inválidas.
    Lista de propiedades requeridas:
    * first_name: necesita un String, se recibió ${user.first_name}
    * last_name: necesita un String, se recibió ${user.last_name}
    * email: necesita un String, se recibió ${user.email}
    `
}

export const generateProductExistsErrorInfo = (productId) => {
    return `The product doesn´t exist. Received ${productId}`
}

export const generateProductCodeErrorInfo = (productCode) => {
    return `There is already a product with that code. Received ${productCode}`
}

export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: necesita un String, se recibió ${product.title}
    * description: necesita un String, se recibió ${product.description}
    * price: necesita un Number, se recibió ${product.price}
    * code: necesita un String, se recibió ${product.code}
    * stock: necesita un String, se recibió ${product.stock}
    * category: necesita un String, se recibió ${product.category}
    `
}

export const generateCartErrorInfo = (cartId) => {
    return `Cart doesn´t exist. Received ${cartId}`
}

export const generateEmptyCartErrorInfo = (cartId) => {
    return `Cart has no products!. Received ${cartId}`
}