/* ========================================================================================
VARIABLES
======================================================================================== */

let market = {
  // VARIABLES
  words: ["COMING SOON", "MARKETPLACE"],
  // FUNCTIONS
  initialise: undefined,
  subscription: undefined,
  subscribe: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  market.initialise
// @desc  
market.initialise = async () => {
  updateSessionPage();
  // GET LOGIN STATUS 
  let data;
  try {
    data = (await axios.get("/login-status"))["data"];
  } catch (error) {
    return console.log(error);
  }
  const login = data.status;
  // LOAD SYSTEMS
  try {
    await global.initialise(true, true, login);
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // LOAD SESSION
  session.initialise();
  // ADD THE DYNAMIC WORDS EFFECT
  textSequence(0, market.words, "change-text");
  market.subscription(login);
}

// @func  market.subscription
// @desc  
market.subscription = (login = false) => {
  // INPUT FIELD DISPLAY
  if (login) {
    document.querySelector("#subscribe-field").classList.add("hide");
  }
  // BUTTON ATTRIBUTE
  document.querySelector("#subscribe-main").setAttribute("onclick", `market.subscribe(${login});`);
}

// @func  market.subscribe
// @desc  
market.subscribe = async (login = false) => {
  document.querySelector("#subscribe-email-error").innerHTML = "";
  // DISABLE
  document.querySelector("#subscribe-main").setAttribute("disabled", "");
  // COLLECT
  const email = (!login) ? document.querySelector("#subscribe-email-input").value : "";
  // VALIDATE
  if (!login) {
    let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email === "") {
      document.querySelector("#subscribe-email-error").innerHTML = "an email is required";
      return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
    } else if (!emailRE.test(String(email).toLowerCase())) {
      document.querySelector("#subscribe-email-error").innerHTML = "invalid email";
      return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
    }
  }
  // SUBMIT
  let data;
  try {
    data = (await axios.post("/subscribe/mailing-list", { email }))["data"];
  } catch (error) {
    console.log(error);
    notification.popup("an error ocurred", "failed");
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  }
  if (data.status === "failed") {
    console.log(data.content);
    notification.popup("an error ocurred", "failed");
    return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
  }
  // SUCCESS
  let message;
  if (data.content === "already subscribed") {
    message = login ? "You are already subscribed" : "This email is already subscribed";
    notification.popup(message, "sent");
  }
  if (data.content === "subscribed") notification.popup("Thank you for subscribing to the newsletter!", "succeeded");
  return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
}

/* ========================================================================================
END
======================================================================================== */