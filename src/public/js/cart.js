let buttons = document.querySelectorAll('#remove-from-cart')
let productId;
let cartId;

buttons.forEach(btn => {
    btn.addEventListener('click', function () {
        productId = this.dataset.productid
        cartId = this.dataset.cartid
        fetch(`${serverUrl}/api/carts/` + cartId + '/product/' + productId, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el producto: ' + response.status)
                }
                location.reload()
            })
            .catch(function (error) {
                console.error(error)
            })
    })
})

let purchaseCartForm = document.getElementById('purchase-cart')
purchaseCartForm.addEventListener('submit', (e) => {
    e.preventDefault()
    displayConfirmPurchaseAlert()
})

displayConfirmPurchaseAlert = () => {
    const cartId = purchaseCartForm.dataset.cartid
    Swal.fire({
        title: '¿Estás seguro de realizar la compra?',
        showCancelButton: true,
        confirmButtonText: `Confirmar`,
        cancelButtonText: `Cancelar`,
        confirmButtonColor: '#572727',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${serverUrl}/api/carts/` + cartId + '/purchase', {
                method: 'POST'
            })
                .then(response => response.json()
                )
                .then(data => {
                    if (data.success === 'No products were purchased due to lack of stock') {
                        Swal.fire('No se pudo realizar la compra debido a falta de stock en los productos!', '', 'error')
                    }
                    if (data.success === 'Purchase completed partially') {
                        Swal.fire({
                            title: 'Compra completada parcialmente!',
                            html: `Algunos productos no pudieron ser comprados debido a falta de stock: 
                            <br>
                            <ul>
                                ${data.payload.map(product => `<li>${product.name}</li>`).join('')}
                            </ul>`,
                            icon: 'warning',
                            timer: 3000,
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#572727',
                        }).then(() => {
                            location.reload()
                        })
                    }
                    if (data.success === 'Purchase completed successfully') {
                        Swal.fire({
                            title: 'Compra realizada con éxito!',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#572727',
                            timer: 3000
                        }).then(() => {
                            location.href = '/products'
                        })
                    }
                })
                .catch(function (error) {
                    console.error(error)
                    Swal.fire('Error al finalizar compra!', '', 'error')
                })
        }
    })
}