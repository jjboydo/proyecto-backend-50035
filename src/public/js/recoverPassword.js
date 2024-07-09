let recoverPasswordForm = document.getElementById('recoverPasswordForm')

recoverPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const button = recoverPasswordForm.querySelector('button')
    button.setAttribute('disabled', true)
    button.innerText = 'Enviando...'

    fetch(`${serverUrl}/api/sessions/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
        .then(response => response.json())
        .then(data => {
            button.removeAttribute('disabled')
            if (data.status === "error") {
                button.innerText = 'Enviar correo de recuperación'
                Swal.fire({
                    title: 'Error',
                    text: "El email ingresado no se encuentra registrado",
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#572727',
                })
            } else {
                button.innerText = 'Enviado'
                Swal.fire({
                    title: 'Email enviado con éxito!',
                    text: 'Revisa tu casilla de correo para restablecer tu contraseña',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#572727',
                    timer: 3000
                }).then(() => {
                    location.href = '/login'
                })
            }
        })
        .catch(error => {
            console.error(error)
        })
})