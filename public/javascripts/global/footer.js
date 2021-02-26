/* ========================================================================================
VARIABLES
======================================================================================== */

let footer = {
  initialise: undefined,
  addListener: undefined,
  subscribeClick: undefined,
  subscribeSubmit: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  footer.initialise
// @desc
//footer.initialise = (login = false) => {
// V1
// footer.subscription(login);
footer.initialise = () => {
  footer.addListener();
  document.getElementById('footer-subscribe-email-input').addEventListener('keypress', ({key}) => {
    if (key === 'Enter') {
      footer.subscribeSubmit()
    }
  })
  document.getElementById('footer-subscribe-submit').addEventListener('click', () => {
    footer.subscribeSubmit()
  })
}

// @func  footer.addListener
// @desc  
footer.addListener = () => {
  document.querySelector("#footer-subscribe").addEventListener("click", () => footer.subscribeClick());
}

// @func  footer.subscribeClick
// @desc  
footer.subscribeClick = () => {
  document.getElementById('footer-subscribe').classList.toggle('hide');
  document.getElementById('footer-subscribe-field').classList.toggle('hide');
}

// @func  footer.subscribeSubmit
// @desc  
footer.subscribeSubmit = async () => {
  // DISABLE
  document.querySelector("#footer-subscribe-submit").setAttribute("onclick", "");
  document.querySelector("#footer-subscribe-email-input").setAttribute("disabled", "");
  // COLLECT
  const email = document.querySelector("#footer-subscribe-email-input").value;
  // VALIDATE
  let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === "") {
    notification.popup("Email is required", "failed");
    document.querySelector("#footer-subscribe-submit").setAttribute("onclick", "footer.subscribeSubmit();");
    document.querySelector("#footer-subscribe-email-input").removeAttribute("disabled");
    return;
  } else if (!emailRE.test(String(email).toLowerCase())) {
    notification.popup("Invalid email", "failed");
    document.querySelector("#footer-subscribe-submit").setAttribute("onclick", "footer.subscribeSubmit();");
    document.querySelector("#footer-subscribe-email-input").removeAttribute("disabled");
    return;
  }
  // SUBMIT
  try {
    await global.subscribeToMailingList(email);
  } catch (error) {
    document.querySelector("#footer-subscribe-submit").setAttribute("onclick", "footer.subscribeSubmit();");
    document.querySelector("#footer-subscribe-email-input").removeAttribute("disabled");
    return;
  }
  // SUCCESS HANDLER
  document.querySelector("#footer-subscribe-submit").setAttribute("onclick", "footer.subscribeSubmit();");
  document.querySelector("#footer-subscribe-email-input").removeAttribute("disabled");
  document.querySelector("#footer-subscribe-email-input").value = "";
  footer.subscribeClick();
  return;
}

/* ========================================================================================
END
======================================================================================== */