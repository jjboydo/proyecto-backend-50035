let loginForm = document.getElementById('form-login')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    fetch('http://localhost:8080/api/sessions/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json()
        )
        .then(data => {
            if (data.error === 'Failed login') {
                Swal.fire('Error', 'El login falló. Por favor intente nuevamente', 'error')
            }
            if (data.message === 'Logged in!') {
                location.href = '/'
            }
        })
        .catch(function (error) {
            console.error(error)
            Swal.fire('Error', 'Failed login', 'error')
        })
})