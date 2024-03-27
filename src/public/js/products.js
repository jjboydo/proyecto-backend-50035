let buttons = document.querySelectorAll('#add-to-cart')
let productId;

buttons.forEach(btn => {
    btn.addEventListener('click', function () {
        document.getElementById("products-list").style.display = "none"
        document.getElementById("pagination").style.display = "none"
        document.getElementById("cart-modal").style.display = "flex"
        productId = this.dataset.productid
    })
})

document.getElementById('add-to-cart-confirm').addEventListener('click', () => {
    document.getElementById("products-list").style.display = "flex"
    document.getElementById("pagination").style.display = "flex"
    document.getElementById("cart-modal").style.display = "none"
})

document.getElementById('add-to-cart-form').addEventListener('submit', (e) => {
    e.preventDefault()

    let cartId = document.getElementById("add-to-cart-confirm").dataset.cartid

    fetch('http://localhost:8080/api/carts/' + cartId + '/product/' + productId, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar el producto: ' + response.status)
            }
        })
        .catch(function (error) {
            console.error(error)
        })
});