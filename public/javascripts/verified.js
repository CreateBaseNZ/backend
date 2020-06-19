const verifiedInit = async () => {
    // GET LOGIN STATUS 
    let data;
    try {
        data = (await axios.get("/login-status"))["data"];
    } catch (error) {
        return console.log(error);
    }
    const login = data.status;
    // LOAD SYSTEM
    try {
        await global.initialise(true, true, login);
    } catch (error) {
        return console.log(error);
    }
    // REMOVE STARTUP LOADER
    removeLoader();
    if (!login) loginBtnHide();
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