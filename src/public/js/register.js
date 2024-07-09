let registerForm = document.getElementById('form-register')

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let first_name = document.getElementById('first_name').value
    let last_name = document.getElementById('last_name').value
    let email = document.getElementById('email').value
    let age = document.getElementById('age').value
    let password = document.getElementById('password').value
    fetch('http://localhost:8080/api/sessions/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ first_name, last_name, email, age, password })
    })
        .then(response => response.json()
        )
        .then(data => {
            if (data.error === 'Failed register') {
                Swal.fire('Error', 'El usuario ya existe en el sistema. Por favor intente con otro email', 'error')
            }
            if (data.status === 'success') {
                location.href = '/login'
            }
        })
        .catch(function (error) {
            console.error(error)
            Swal.fire('Error', 'Hubo un problema con el registro. Por favor intente nuevamente', 'error')
        })
})
