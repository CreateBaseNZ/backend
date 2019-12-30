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
let srvsTglBool;
let menuTglEvt;
let menuHvrEvt1;
let menuHvrEvt2;
let menuHvrEvt3;
let menuHvrEvt4;
let userMenuTglEvt;
let userMenuTglEvtDktp;
let msgsTglEvt;
let msgsTglEvtDktp;
let ntfsTglEvt;
let srvsTglEvtDktp;

/* -------------------------------
INITIALISE
------------------------------- */

window.onload = () => {
  menuTglBool = false;
  userMenuTglBool = false;
  msgsTglBool = false;
  ntfsTglBool = false;
  srvsTglBool = false;
  menuTglEvt = document
    .querySelector(".menu-btn")
    .addEventListener("click", menuTgl);
  menuHvrEvt1 = document
    .querySelector(".menu")
    .addEventListener("mouseenter", menuHvr);
  menuHvrEvt2 = document
    .querySelector(".menu")
    .addEventListener("mouseleave", menuHvr);
  menuHvrEvt3 = document
    .querySelector(".menu-btn-dktp")
    .addEventListener("mouseenter", menuHvr);
  menuHvrEvt4 = document
    .querySelector(".menu-btn-dktp")
    .addEventListener("mouseleave", menuHvr);
  userMenuTglEvt = document
    .querySelector(".user-menu-btn")
    .addEventListener("click", userMenuTgl);
  userMenuTglEvtDktp = document
    .querySelector(".user-menu-btn-dktp")
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
  document
    .querySelector("#nav-btns-log-in-dktp")
    .classList.toggle("nav-btns-dktp-hide");
  document
    .querySelector("#nav-btns-log-out-dktp")
    .classList.toggle("nav-btns-dktp-hide");
  // Click Event Listeners
  msgsTglEvt = document
    .querySelector(".msg-btn")
    .addEventListener("click", msgsTgl);
  msgsTglEvtDktp = document
    .querySelector(".msg-btn-dktp")
    .addEventListener("click", msgsTgl);
  ntfsTglEvt = document
    .querySelector(".ntf-btn")
    .addEventListener("click", ntfsTgl);
  ntfsTglEvtDktp = document
    .querySelector(".ntf-btn-dktp")
    .addEventListener("click", ntfsTgl);
  srvsTglEvtDktp = document
    .querySelector(".srvs-btn-dktp")
    .addEventListener("click", srvsTgl);
};

// Check Authentication (TEMP)

let auth = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(true);
  }, 1000);
});

// Toggle the menu page

let menuTgl = () => {
  if (userMenuTglBool) userMenuTgl();
  if (msgsTglBool) msgsTgl();
  if (ntfsTglBool) ntfsTgl();
  if (srvsTglBool) srvsTgl();
  menuTglBool = menuTglBool ? false : true;
  document.querySelector(".menu-dash-1").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu-dash-2").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu-dash-3").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu").classList.toggle("menu-untgl");
  document.querySelector(".menu-btn").classList.toggle("nav-btn-untgl");
};

// Hover menu
let menuHvr = () => {
  document.querySelector(".menu-dash-1-dktp").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu-dash-2-dktp").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu-dash-3-dktp").classList.toggle("menu-dash-tgl");
  document.querySelector(".menu").classList.toggle("menu-dktp-hvr");
};

// Toggle the user menu page

let userMenuTgl = () => {
  if (menuTglBool) menuTgl();
  if (msgsTglBool) msgsTgl();
  if (ntfsTglBool) ntfsTgl();
  if (srvsTglBool) srvsTgl();
  userMenuTglBool = userMenuTglBool ? false : true;
  document.querySelector(".user-menu").classList.toggle("user-menu-untgl");
};

// Toggle the messages page

let msgsTgl = () => {
  if (menuTglBool) menuTgl();
  if (userMenuTglBool) userMenuTgl();
  if (ntfsTglBool) ntfsTgl();
  if (srvsTglBool) srvsTgl();
  msgsTglBool = msgsTglBool ? false : true;
  document.querySelector(".msgs").classList.toggle("msgs-untgl");
  document.querySelector(".msg-btn").classList.toggle("nav-btn-untgl");
};

// Toggle the notifications page

let ntfsTgl = () => {
  if (menuTglBool) menuTgl();
  if (userMenuTglBool) userMenuTgl();
  if (msgsTglBool) msgsTgl();
  if (srvsTglBool) srvsTgl();
  ntfsTglBool = ntfsTglBool ? false : true;
  document.querySelector(".ntfs").classList.toggle("ntfs-untgl");
  document.querySelector(".ntf-btn").classList.toggle("nav-btn-untgl");
};

// Toggle the services icon

let srvsTgl = () => {
  if (menuTglBool) menuTgl();
  if (userMenuTglBool) userMenuTgl();
  if (msgsTglBool) msgsTgl();
  if (ntfsTglBool) ntfsTgl();
  srvsTglBool = srvsTglBool ? false : true;
  document.querySelector(".srvs").classList.toggle("srvs-untgl");
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
FUNCTIONS - Menu
------------------------------- */
