const verificationInit = () => {
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