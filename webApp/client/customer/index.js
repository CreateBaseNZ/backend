/* -------------------------------
TEST OBJECTS
------------------------------- */

/* -------------------------------
VARIABLES
------------------------------- */

let menuTglBool;
let userMenuTglBool;
let msgsTglBool;
let ntfsTglBool;
let menuTglEvt;
let userMenuTglEvt;
let msgsTglEvt;
let ntfsTglEvt;

/* -------------------------------
INITIALISE
------------------------------- */

window.onload = () => {
  menuTglBool = false;
  userMenuTglBool = false;
  msgsTglBool = false;
  ntfsTglBool = false;
  menuTglEvt = document
    .querySelector(".menu-btn")
    .addEventListener("click", menuTgl);
  userMenuTglEvt = document
    .querySelector(".user-menu-btn")
    .addEventListener("click", userMenuTgl);
  // Load Initial Classes
  auth
    .then(authStts => {
      if (authStts) {
        navSysLogIn(); // Display Navigation for logged in user
        loadNtfs(); // Load notifications if user is logged in
      }
    })
    .catch(err => console.log(err));
};

/* -------------------------------
FUNCTIONS
------------------------------- */

// Set Navigation based on authentication

let navSysLogIn = () => {
  // CSS Display
  document.querySelector(".menu").classList.toggle("sd-bar-nav-bar-hide");
  document.querySelector(".user-menu").classList.toggle("sd-bar-nav-bar-hide");
  document.querySelector(".msgs").classList.toggle("sd-bar-nav-bar-hide");
  document.querySelector(".ntfs").classList.toggle("sd-bar-nav-bar-hide");
  document.querySelector(".nav-bar-btm").classList.toggle("nav-bar-hide");
  document
    .querySelector(".user-menu-log-in")
    .classList.toggle("user-menu-opts-hide");
  document
    .querySelector(".user-menu-log-out")
    .classList.toggle("user-menu-opts-hide");
  // Click Event Listeners
  msgsTglEvt = document
    .querySelector(".msg-btn")
    .addEventListener("click", msgsTgl);
  ntfsTglEvt = document
    .querySelector(".ntf-btn")
    .addEventListener("click", ntfsTgl);
};

// Check Authentication (TEMP)

let auth = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(false);
  }, 1000);
});

// Toggle the menu page

let menuTgl = () => {
  if (userMenuTglBool) userMenuTgl();
  if (msgsTglBool) msgsTgl();
  if (ntfsTglBool) ntfsTgl();
  menuTglBool = menuTglBool ? false : true;
  document.querySelector(".menu-dash-1").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu-dash-2").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu-dash-3").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu").classList.toggle("cntt-untgl-lft");
  document.querySelector(".menu-btn").classList.toggle("nav-btn-untgl");
};

// Toggle the user menu page

let userMenuTgl = () => {
  if (menuTglBool) menuTgl();
  if (msgsTglBool) msgsTgl();
  if (ntfsTglBool) ntfsTgl();
  userMenuTglBool = userMenuTglBool ? false : true;
  document.querySelector(".user-menu").classList.toggle("cntt-untgl-rght");
};

// Toggle the messages page

let msgsTgl = () => {
  if (menuTglBool) menuTgl();
  if (userMenuTglBool) userMenuTgl();
  if (ntfsTglBool) ntfsTgl();
  msgsTglBool = msgsTglBool ? false : true;
  document.querySelector(".msgs").classList.toggle("cntt-untgl-bot");
  document.querySelector(".msg-btn").classList.toggle("nav-btn-untgl");
};

// Toggle the notifications page

let ntfsTgl = () => {
  if (menuTglBool) menuTgl();
  if (userMenuTglBool) userMenuTgl();
  if (msgsTglBool) msgsTgl();
  ntfsTglBool = ntfsTglBool ? false : true;
  document.querySelector(".ntfs").classList.toggle("cntt-untgl-bot");
  document.querySelector(".ntf-btn").classList.toggle("nav-btn-untgl");
};

// Date difference object

let dateDiffInObj = (date1, date2) => {
  let diffObj = {
    years: date1.diff(date2, "years"),
    months: date1.diff(date2, "months") % 12,
    weeks: date1.diff(date2, "weeks") % 4,
    days: date1.diff(date2, "days") % 7,
    hours: date1.diff(date2, "hours") % 24,
    minutes: date1.diff(date2, "minutes") % 60,
    seconds: date1.diff(date2, "seconds") % 60
  };
  return diffObj;
};

// Get difference between two dates

let dateDiff = (date1, date2) => {
  let date1Mmnt = dateObjToMmnt(date1);
  let date2Mmnt = dateObjToMmnt(date2);
  let diff = date1Mmnt.diff(date2Mmnt);
  return diff;
};

// Date object to moment conversion

let dateObjToMmnt = dateObj => {
  let dateStr = `${dateObj.month}-${dateObj.date}-${dateObj.year}-
             ${dateObj.hour}-${dateObj.minute}-${dateObj.second}`;
  let dateMmnt = moment(dateStr, "MM-DD-YYYY-HH-mm-ss");
  return dateMmnt;
};

/* -------------------------------
FUNCTIONS
------------------------------- */
