
const socket = io()

const createProductElement = (product) => {
    const productElement = document.createElement('div')
    productElement.classList.add('card')
    productElement.innerHTML = `
    <p><strong>Nombre del producto:</strong> ${product.title}</p>
    <p><strong>Descripción:</strong> ${product.description}</p>
    <p><strong>Precio:</strong> $${product.price}</p>
    <p><strong>Código:</strong> ${product.code}</p>
  `
    return productElement
}

socket.on('product_updated', (products) => {
    const productsContainer = document.getElementById('products-container')
    productsContainer.innerHTML = ''
    products.forEach((product) => {
        const productElement = createProductElement(product)
        productsContainer.appendChild(productElement)
    })
})