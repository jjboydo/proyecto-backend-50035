document.addEventListener('DOMContentLoaded', () => {
    let buttons = document.querySelectorAll('#add-to-cart')

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-productid');
            const cartId = btn.getAttribute('data-cartid');
            Swal.fire({
                title: '¿Estás seguro de agregar este producto al carrito?',
                showCancelButton: true,
                confirmButtonText: `Confirmar`,
                cancelButtonText: `Cancelar`,
                confirmButtonColor: '#572727',
            }).then((result) => {
                if (result.isConfirmed) {

                    fetch(`${serverUrl}/api/carts/` + cartId + '/product/' + productId, {
                        method: 'POST'
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al agregar el producto: ' + response.status)
                            }
                        })
                        .then(() => {
                            Swal.fire('Producto agregado al carrito!', '', 'success');
                        })
                        .catch(function (error) {
                            console.error(error)
                            Swal.fire('Error al agregar el producto al carrito!', '', 'error')
                        })
                }
            })
        })
    })
});