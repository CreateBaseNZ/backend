/* ========================================================================================
VARIABLES
======================================================================================== */

let engkits = {
  // VARIABLES
  words: ["COMING SOON", "ENGINEERING KITS"],
  // FUNCTIONS
  initialise: undefined,
  subscription: undefined,
  subscribe: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  engkits.initialise
// @desc  
engkits.initialise = async () => {
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
  textSequence(0, engkits.words, "change-text");
  engkits.subscription(login);
}

// @func  engkits.subscription
// @desc  
engkits.subscription = (login = false) => {
  // INPUT FIELD DISPLAY
  if (login) {
    document.querySelector("#subscribe-field").classList.add("hide");
  }
  // BUTTON ATTRIBUTE
  document.querySelector("#subscribe-main").setAttribute("onclick", `engkits.subscribe(${login});`);
}

// @func  engkits.subscribe
// @desc  
engkits.subscribe = async (login = false) => {
  document.querySelector("#subscribe-email-error").innerHTML = "";
  // DISABLE
  document.querySelector("#subscribe-main").setAttribute("disabled", "");
  // COLLECT
  const email = (!login) ? document.querySelector("#subscribe-email-input").value : "";
  // VALIDATE
  if (!login) {
    if (email === "") {
      document.querySelector("#subscribe-email-error").innerHTML = "an email is required";
      return document.querySelector("#subscribe-main").removeAttribute("disabled"); // ENABLE
    }
    // TO DO .....
    // REGEX VALIDATION
    // TO DO .....
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