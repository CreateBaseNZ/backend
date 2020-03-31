const signupInit = () => {
    const inputName = document.querySelector('#sign-up-eml')
    const inputPass = document.querySelector('#sign-up-pwd')
    const confirm = document.getElementById('confirm-pass')
    const confirmInput = document.getElementById('sign-up-cfrm-pwd')

    inputPass.addEventListener('input', () => {
        if (inputPass.value.length) {
            confirm.classList.add('dip-down')
        } else {
            confirm.classList.remove('dip-down')
            confirmInput.value = ""
        }
    })
}
