const verificationInit = async () => {
    let loginStatus

    try{
        loginStatus = await checkLoginStatus();
    } catch (error){
        return console.log(error);
    }

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

//Verfication submit with button
const verifyCode = async () => {
  let verifyBtn = document.querySelector('.verifyBtn')
  let allElements = document.querySelectorAll('.verifyClass');
  let completeCode = concatInput();

  //Regex - error handling of input
  let i;
  if (completeCode == undefined  || completeCode.length < allElements.length){
    for (i = 0; i < allElements.length; i++) {
      let el = allElements[i];
      el.classList.add('inputError');
      setTimeout(function(){
        el.classList.remove('inputError');
      }, 1000);
      document.querySelector('#instrucText').innerHTML = "Input complete code"
      document.querySelector('#instrucText').style.color = 'red'
    }
    return;
  }
  const query = {  code: completeCode };
  // Check Backend
  let data;
  try{
    data = (await axios.post("/account/verify", query))["data"];
  } catch (error){
    return console.log(error);
  }
  if (data.status === "failed"){
    //add error classes & animation
    for (i = 0; i < allElements.length; i++) {
      let el = allElements[i];
      el.classList.add('inputError');
      setTimeout(function(){
        el.classList.remove('inputError');
      }, 1000);
      if (data.content === "incorrect code"){
        document.querySelector('#instrucText').innerHTML = "Incorrect code"
        document.querySelector('#instrucText').style.color = 'red'
      }
    }
    return
  }

  window.location.href = "/verified";
}

const concatInput = () => {
    let code = ''
    let form = document.querySelector('#codeForm')

    for (let i = 0; i < form.elements.length; i++) {
      code += form.elements[i].value
    }

    console.log(code)
    return code
}

//Input listener
const checkRegex = (event) => {
  //Regex checks if input is non number or digit
  let regex = RegExp(/[\d]+/)
  let keyValue = event.key

  if (regex.test(keyValue)) { //input is valid
    return true
  } else{
    return false
  }
}

const inputListener = () => {  
  let allElements = document.querySelectorAll('.verifyClass');
  let i;
  for (i = 0; i < allElements.length; i++) {
    let el = allElements[i];
    el.addEventListener("keypress", function(event) {
      if (checkRegex(event)){
        if (this.nextSibling.nextSibling != null){
          this.nextSibling.nextSibling.focus();
        }
      } 
      else {
        event.preventDefault();
        //Failed regex - replace input to avoid false inputs to server
        el.value = "";
      }
    });
  }
}