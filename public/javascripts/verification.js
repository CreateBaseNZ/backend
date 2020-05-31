const verificationInit = async () => {
    let loginStatus

    try{
        loginStatus = await checkLoginStatus();
    } catch (error){
        return console.log(error);
    }

    if (loginStatus) loginBtnHide();

    inputListener()
}

const loginBtnHide = () => {
    let loginBtn = document.querySelector('.loginLink')
    loginBtn.classList.add('hide')
}

const emailVerification = async () => {
  let data;
  try {
    data = (await axios.get("/account/email-verification"))["data"];
  } catch (error) {
    // TO DO.....
    // Error handling
    // TO DO.....
    return console.log(error);
  }
  // ERROR HANDLER
  if (data.status === "failed") {
    // TO DO.....
    // Error handling
    // TO DO.....
    return console.log(data.content);
  }
  // SUCCESS HANDLER
  // TO DO.....
  // Success notifcation
  // TO DO.....
  return console.log(data.content);
}

const verifyCode = () => {
  let verifyBtn = document.querySelector('.verifyBtn')
  concatInput()
}

const concatInput = () => {
    let code = ''
    let form = document.querySelector('#codeForm')

    for (let i = 0; i < form.elements.length; i++) {
      code += form.elements[i].value
    }

    console.log(code)
}








// const checkRegex = () => {

// }

function moveNext(input){
  let firstInput = input
  if (firstInput.nextElementSibling != null) {
    firstInput.nextElementSibling.focus()
    console.log('keypress')
  }
}

const inputListener = () => {  
  let form = document.querySelector('#codeForm')
  let children = form.elements

  console.log(children)

  // for (let i = 0; i < form.elements.length; i++) {
  //   // form.elements.addEventListener("input", checkRegex())
  //   form.elements[i].addEventListener("keypress", moveNext(form.elements[i]))
  // }

  Array.from(children).forEach(function(el, i){
    // form.elements.addEventListener("input", checkRegex())
    el.addEventListener("keypress", moveNext(el))
  });


}