const verifiedInit = async () => {
    let loginStatus

    try{
        loginStatus = await checkLoginStatus();
    } catch (error){
        return console.log(error);
    }

    if (!loginStatus) loginBtnHide();
}

const loginBtnHide = () => {
    let loginBtn = document.querySelector('.loginLink')
    loginBtn.classList.remove('hide')
}

const homeRedirect = () => {
    this.onclick = function () {
        location.href = "/";
    };
}