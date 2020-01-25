/*=========================================================================================
VARIABLES
=========================================================================================*/

let selectedMakePage = 1;
let makeValidity = {
  uploadModel: false,
  orderDetails: false
};
let makeQuickBuildOptions = {
  prototype: {
    material: "fdm_pla",
    quality: "draft",
    strength: "normal"
  },
  mechanical: {
    material: "fdm_petg",
    quality: "normal",
    strength: "strong"
  }
};

// Elements
let makeNavigationBack;
let makeNavigationNext;
let makeNavigationPage1;
let makeNavigationPage2;
let makeNavigationPage3;
let makeNavigationPage4;
let makeNavigationPage5;
let makeHeaderPage1;
let makeHeaderPage2;
let makeHeaderPage3;
let makeHeaderPage4;
let makeHeaderPage5;

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

/*-----------------------------------------------------------------------------------------
INITIALISATION
-----------------------------------------------------------------------------------------*/

const makeInit = () => {
  makeNavigationBack = document.querySelector("#make-flt-arw-left");
  makeNavigationNext = document.querySelector("#make-flt-arw-rght");
  makeNavigationPage1 = document.querySelector("#make-flt-nav-1");
  makeHeaderPage1 = document.querySelector("#make-sub-hdng-mdl");
  makeNavigationPage2 = document.querySelector("#make-flt-nav-2");
  makeHeaderPage2 = document.querySelector("#make-sub-hdng-bld-type");
  makeNavigationPage3 = document.querySelector("#make-flt-nav-3");
  makeHeaderPage3 = document.querySelector("#make-sub-hdng-bld-opts");
  makeNavigationPage4 = document.querySelector("#make-flt-nav-4");
  makeHeaderPage4 = document.querySelector("#make-sub-hdng-bld-dtls");
  makeNavigationPage5 = document.querySelector("#make-flt-nav-5");
  makeHeaderPage5 = document.querySelector("#make-sub-hdng-bld-smry");
  makeNavigationEventListener();
};

/*-----------------------------------------------------------------------------------------
NAVIGATION EVENT HANDLER
-----------------------------------------------------------------------------------------*/

const makeNavigationEventListener = () => {
  let maxPageNumber = makeMaxPageNumber();
  makeNavigationPage1.addEventListener("click", () => makeShowPage(1));
  makeHeaderPage1.addEventListener("click", () => makeShowPage(1));

  if (selectedMakePage <= 1) {
    makeNavigationBack.removeEventListener("click", makePreviousPage);
    makeNavigationBack.classList.add("flt-arw-1-dsbl");
  } else {
    makeNavigationBack.addEventListener("click", makePreviousPage);
    makeNavigationBack.classList.remove("flt-arw-1-dsbl");
  }

  if (selectedMakePage >= maxPageNumber) {
    makeNavigationNext.removeEventListener("click", makeNextPage);
    makeNavigationNext.classList.add("flt-arw-1-dsbl");
  } else {
    makeNavigationNext.addEventListener("click", makeNextPage);
    makeNavigationNext.classList.remove("flt-arw-1-dsbl");
  }

  if (!makeValidity.uploadModel) {
    makeNavigationPage2.removeEventListener("click", () => makeShowPage(2));
    makeNavigationPage3.removeEventListener("click", () => makeShowPage(3));
    makeNavigationPage4.removeEventListener("click", () => makeShowPage(4));
    makeHeaderPage2.removeEventListener("click", () => makeShowPage(2));
    makeHeaderPage3.removeEventListener("click", () => makeShowPage(3));
    makeHeaderPage4.removeEventListener("click", () => makeShowPage(4));
    makeNavigationPage2.classList.add("flt-nav-1-dsbl");
    makeNavigationPage3.classList.add("flt-nav-1-dsbl");
    makeNavigationPage4.classList.add("flt-nav-1-dsbl");
  } else {
    makeNavigationPage2.addEventListener("click", () => makeShowPage(2));
    makeNavigationPage3.addEventListener("click", () => makeShowPage(3));
    makeNavigationPage4.addEventListener("click", () => makeShowPage(4));
    makeHeaderPage2.addEventListener("click", () => makeShowPage(2));
    makeHeaderPage3.addEventListener("click", () => makeShowPage(3));
    makeHeaderPage4.addEventListener("click", () => makeShowPage(4));
    makeNavigationPage2.classList.remove("flt-nav-1-dsbl");
    makeNavigationPage3.classList.remove("flt-nav-1-dsbl");
    makeNavigationPage4.classList.remove("flt-nav-1-dsbl");
  }

  if (!makeValidity.orderDetails) {
    makeNavigationPage5.removeEventListener("click", () => makeShowPage(5));
    makeHeaderPage5.removeEventListener("click", () => makeShowPage(5));
    makeNavigationPage5.classList.add("flt-nav-1-dsbl");
  } else {
    makeNavigationPage5.addEventListener("click", () => makeShowPage(5));
    makeHeaderPage5.addEventListener("click", () => makeShowPage(5));
    makeNavigationPage5.classList.remove("flt-nav-1-dsbl");
  }
};

/*-----------------------------------------------------------------------------------------
CSS CHANGES
-----------------------------------------------------------------------------------------*/

// Move to previous page
const makePreviousPage = () => {
  if (selectedMakePage == 1) {
    return;
  }

  makeShowPage(selectedMakePage - 1);
};

// Move to next page
const makeNextPage = () => {
  let maxPageNumber = makeMaxPageNumber();

  if (selectedMakePage == maxPageNumber) {
    return;
  }

  makeShowPage(selectedMakePage + 1);
};

// Show hidden page
const makeShowPage = nextPage => {
  let element = document.querySelector(`#make-sub-page-${nextPage}`);

  if (selectedMakePage == nextPage) {
    return;
  }

  makeHidePage(nextPage);
  makeNavCSSUpdate(nextPage);

  element.classList.remove("make-sub-page-rght");
  element.classList.remove("make-sub-page-left");

  selectedMakePage = nextPage;

  makeNavigationEventListener();
  return;
};

// Hide pages
const makeHidePage = nextPage => {
  let element;
  if (selectedMakePage < nextPage) {
    document
      .querySelector(`#make-sub-page-${selectedMakePage}`)
      .classList.add("make-sub-page-left");
    for (let i = selectedMakePage + 1; i < nextPage; i++) {
      element = document.querySelector(`#make-sub-page-${i}`);

      element.classList.add("make-sub-page-left");
      element.classList.remove("make-sub-page-rght");
    }
  } else {
    document
      .querySelector(`#make-sub-page-${selectedMakePage}`)
      .classList.add("make-sub-page-rght");
    for (let i = selectedMakePage - 1; i > nextPage; i--) {
      element = document.querySelector(`#make-sub-page-${i}`);

      element.classList.add("make-sub-page-rght");
      element.classList.remove("make-sub-page-left");
    }
  }

  return;
};

// Update navigations' CSS
const makeNavCSSUpdate = nextPage => {
  document
    .querySelector(`#make-flt-nav-${nextPage}`)
    .classList.toggle("flt-nav-1-slct");
  document
    .querySelector(`#make-flt-nav-${selectedMakePage}`)
    .classList.toggle("flt-nav-1-slct");
};

// Determine the maximum page number accessible
const makeMaxPageNumber = () => {
  let maxPageNumber;
  if (!makeValidity.uploadModel) {
    maxPageNumber = 1;
  } else {
    if (!makeValidity.orderDetails) {
      maxPageNumber = 4;
    } else {
      maxPageNumber = 5;
    }
  }
  return maxPageNumber;
};

/*-----------------------------------------------------------------------------------------
UPLOAD MODEL
-----------------------------------------------------------------------------------------*/

// Execute whenever a file is uploaded
const makeUpload = file => {
  // Check if the upload was cancelled
  if (!file) {
    return;
  }
  // Change displayed name
  const object = splitFileName(file.name);
  const name = makeShortenFileName(object.name) + "." + object.extension;
  document.querySelector("#make-file-name").innerHTML = name;
  // Validate
  const errors = makeValidateUpload(object.extension);
  if (errors.length) {
    makeValidity.uploadModel = false;
  } else {
    makeValidity.uploadModel = true;
  }
  makeNavigationEventListener();
  return;
};

// GLOBAL: Split file name to name and extension
const splitFileName = fileName => {
  const nameSplit = fileName.split(".");
  return {
    name: nameSplit[0],
    extension: nameSplit[1]
  };
};

// Shortens the file names if exceeds the 25 character threshold
const makeShortenFileName = name => {
  const stringLength = name.length;
  if (stringLength > 25) {
    firstString = name.slice(0, 10);
    middleString = " ... ";
    lastString = name.slice(stringLength - 10);
  } else {
    firstString = name;
    middleString = "";
    lastString = "";
  }
  return firstString + middleString + lastString;
};

// Validate make file upload
const makeValidateUpload = extension => {
  let errors = [];

  const string = extension.toUpperCase();

  if (string != "STL" && string != "OBJ" && string != "3MF") {
    errors.push("Invalid File");
  }

  return errors;
};

/*-----------------------------------------------------------------------------------------
BUILD TYPE
-----------------------------------------------------------------------------------------*/

const makeQuickBuild = () => {
  const build = document.querySelector("#make-qck-bld").value;
  const options = makeQuickBuildOptions[build];
  document.querySelector("#make-mtrl").value = options.material;
  document.querySelector("#make-qlty").value = options.quality;
  document.querySelector("#make-strn").value = options.strength;
  makeShowPage(4);
};

const makeCustomBuild = () => {
  makeShowPage(3);
};

/*-----------------------------------------------------------------------------------------
ORDER DETAILS
-----------------------------------------------------------------------------------------*/

const makeOrderDetails = value => {
  const errors = makeValidateOrderDetails(value);
  if (errors.length) {
    makeValidity.orderDetails = false;
  } else {
    makeValidity.orderDetails = true;
  }
  makeNavigationEventListener();
  return;
};

const makeValidateOrderDetails = value => {
  let errors = [];

  if (!value) {
    errors.push("Specify Quantity");
  }

  return errors;
};

/*-----------------------------------------------------------------------------------------
MAKE SUMMARY
-----------------------------------------------------------------------------------------*/

const makeSummary = () => {
  let details = makeGetDetails();
  let name = makeShortenFileName(details.get("model").name);
  document.querySelector("#make-smry-file-name").innerHTML = name;
  document.querySelector("#make-smry-mtrl").innerHTML = details.get("material");
  document.querySelector("#make-smry-qlty").innerHTML = details.get("quality");
  document.querySelector("#make-smry-strn").innerHTML = details.get("strength");
  document.querySelector("#make-smry-clr").innerHTML = details.get("colour");
  document.querySelector("#make-smry-qnty").innerHTML = details.get("quantity");
};

const makeGetDetails = () => {
  let details = new FormData(document.querySelector("#make-mdl-form"));
  const material = document.querySelector("#make-mtrl").value.split("_");
  details.append("process", material[0]);
  details.append("material", material[1]);
  details.append("quality", document.querySelector("#make-qlty").value);
  details.append("strength", document.querySelector("#make-strn").value);
  details.append("colour", document.querySelector("#make-clr").value);
  details.append("quantity", document.querySelector("#make-qnty").value);
  details.append("note", document.querySelector("#make-note").value);
  details.append("date", moment()._d);
  return details;
};

/*-----------------------------------------------------------------------------------------
SUBMIT
-----------------------------------------------------------------------------------------*/

const makeProceed = type => {
  document
    .querySelector(`#make-sub-page-${type}`)
    .classList.remove("make-sub-page-hd");
};

const makeNo = type => {
  document
    .querySelector(`#make-sub-page-${type}`)
    .classList.add("make-sub-page-hd");
};

const makeCancel = () => {
  document
    .querySelector("#make-sub-page-cancel")
    .classList.add("make-sub-page-hd");
  document
    .querySelector("#make-sub-page-exit")
    .classList.remove("make-sub-page-hd");
};

const makeCheckout = async () => {
  let submission = makeGetDetails();
  document
    .querySelector("#make-sub-page-load")
    .classList.remove("make-sub-page-hd");

  try {
    let response = await axios.post("/make/submit", submission);
  } catch (error) {}

  document
    .querySelector("#make-sub-page-thnk")
    .classList.remove("make-sub-page-hd");

  document
    .querySelector("#make-sub-page-load")
    .classList.add("make-sub-page-hd");
};

/*=========================================================================================
END
=========================================================================================*/
