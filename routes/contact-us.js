/*=========================================================================================
REQUIRED MODULES
=========================================================================================*/

const express = require("express");

/*=========================================================================================
VARIABLES
=========================================================================================*/

const router = new express.Router();

/*=========================================================================================
MODELS
=========================================================================================*/

const Message = require("../model/Message.js");

/*=========================================================================================
ROUTES
=========================================================================================*/

// @route   POST /contact-us/submit-inquiry
// @desc    
// @access  PUBLIC
router.post("/contact-us/submit-inquiry", async (req, res) => {
  // CREATE THE INQUIRY
  // inquiry number
  let inquiries;
  try {
    inquiries = await Message.find({ type: "inquiry" });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  const number = { inquiry: (inquiries.length + 1) };
  const inquiry = {
    type: "inquiry", name: req.body.name, email: req.body.email,
    subject: req.body.subject, message: req.body.message, number
  };
  // CREATE THE MESSAGE
  let message;
  try {
    message = await Message.build(inquiry);
  } catch (data) {
    return res.send(data);
  }
  // SEND NOTIFICATION
  /*
  try {
    await message.sendInquiryEmailNotification();
  } catch (error) {
    return res.send(data);
  }
  */
  // SUCCESS HANDLER
  return res.send({ status: "succeeded", content: "Inquiry has been sent" });
});

/*=========================================================================================
EXPORT ROUTE
=========================================================================================*/

module.exports = router;

/*=========================================================================================
END
=========================================================================================*/
