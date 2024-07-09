let resetPasswordForm = document.getElementById('resetPasswordForm')

resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const token = resetPasswordForm.dataset.token
    const password = document.getElementById('password').value

    fetch(`${serverUrl}/api/sessions/update-password/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })
        .then(response => response.json())
        .then(data => {
            console.log("DATA:", data)
            if (data.status === 'error') {
                Swal.fire({
                    title: 'Error',
                    text: "La contraseña no puede ser igual a la anterior",
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#572727',
                })
            } else {
                Swal.fire({
                    title: 'Contraseña actualizada con éxito!',
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
