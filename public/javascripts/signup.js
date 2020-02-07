/*=========================================================================================
VARIABLES
=========================================================================================*/

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const input = document.querySelector('#sign-up-pwd');
const confirm = document.getElementById('confirm-pass');
const confirmInput = document.getElementById('sign-up-cfrm-pwd');

input.addEventListener('input', () => {
    if (input.value.length) {
        confirm.classList.add('dip-down');
    } else {
        confirm.classList.remove('dip-down');
        confirmInput.value = "";
    }
});

/*=========================================================================================
END
=========================================================================================*/