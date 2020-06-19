/* ========================================================================================
VARIABLES
======================================================================================== */

let footer = {
  initialise: undefined,
  subscription: undefined,
  subscribe: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  footer.initialise
// @desc  
footer.initialise = (login = false) => {
  footer.subscription(login);
}

// @func  footer.subscription
// @desc  
footer.subscription = (login = false) => {
  const clickEvent = (login) ? `footer.subscribe(${login});` : "window.location.assign('/services/marketplace');";
  return document.querySelector("#footer-subscribe").setAttribute("onclick", clickEvent);
}

// @func  footer.subscribe
// @desc
footer.subscribe = async (login = false) => {
  // DISABLE
  document.querySelector("#footer-subscribe").setAttribute("disabled", "");
  // VALIDATE
  if (!login) {
    notification.popup("an error ocurred", "failed");
    return document.querySelector("#footer-subscribe").removeAttribute("disabled"); // ENABLE
  }
  // SUBMIT
  let data;
  try {
    data = (await axios.post("/subscribe/mailing-list", { email: "" }))["data"];
  } catch (error) {
    console.log(error);
    notification.popup("an error ocurred", "failed");
    return document.querySelector("#footer-subscribe").removeAttribute("disabled"); // ENABLE
  }
  if (data.status === "failed") {
    console.log(data.content);
    notification.popup("an error ocurred", "failed");
    return document.querySelector("#footer-subscribe").removeAttribute("disabled"); // ENABLE
  }
  // SUCCESS
  let message;
  if (data.content === "already subscribed") {
    message = login ? "You are already subscribed" : "This email is already subscribed";
    notification.popup(message, "sent");
  }
  if (data.content === "subscribed") notification.popup("Thank you for subscribing to the newsletter!", "succeeded");
  return document.querySelector("#footer-subscribe").removeAttribute("disabled"); // ENABLE
}

/* ========================================================================================
END
======================================================================================== */