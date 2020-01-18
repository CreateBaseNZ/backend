/*=========================================================================================
VARIABLES
=========================================================================================*/

let selectedMakePage = 1;
let makeValidity = {
  uploadModel: false,
  orderDetails: false
};

// Elements
let makeNavigationBack;
let makeNavigationNext;
let makeNavigationPage1;
let makeNavigationPage2;
let makeNavigationPage3;
let makeNavigationPage4;
let makeNavigationPage5;

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
  makeNavigationPage2 = document.querySelector("#make-flt-nav-2");
  makeNavigationPage3 = document.querySelector("#make-flt-nav-3");
  makeNavigationPage4 = document.querySelector("#make-flt-nav-4");
  makeNavigationPage5 = document.querySelector("#make-flt-nav-5");

  makeNavigationEventListener();
};

/*-----------------------------------------------------------------------------------------
NAVIGATION EVENT HANDLER
-----------------------------------------------------------------------------------------*/

const makeNavigationEventListener = () => {
  let maxPageNumber = makeMaxPageNumber();
  makeNavigationPage1.addEventListener("click", () => makeShowPage(1));

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
    makeNavigationPage2.classList.add("flt-nav-1-dsbl");
    makeNavigationPage3.classList.add("flt-nav-1-dsbl");
    makeNavigationPage4.classList.add("flt-nav-1-dsbl");
  } else {
    makeNavigationPage2.addEventListener("click", () => makeShowPage(2));
    makeNavigationPage3.addEventListener("click", () => makeShowPage(3));
    makeNavigationPage4.addEventListener("click", () => makeShowPage(4));
    makeNavigationPage2.classList.remove("flt-nav-1-dsbl");
    makeNavigationPage3.classList.remove("flt-nav-1-dsbl");
    makeNavigationPage4.classList.remove("flt-nav-1-dsbl");
  }

  if (!makeValidity.orderDetails) {
    makeNavigationPage5.removeEventListener("click", () => makeShowPage(5));
    makeNavigationPage5.classList.add("flt-nav-1-dsbl");
  } else {
    makeNavigationPage5.addEventListener("click", () => makeShowPage(5));
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

  // [TEMPORARY] for testing
  // const string = extension.toUpperCase();

  // if (string != "STL" && string != "OBJ" && string != "3MF") {
  //   errors.push("Invalid File");
  // }

  return errors;
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
  details.append("material", document.querySelector("#make-mtrl").value);
  details.append("quality", document.querySelector("#make-qlty").value);
  details.append("strength", document.querySelector("#make-strn").value);
  details.append("colour", document.querySelector("#make-clr").value);
  details.append("quantity", document.querySelector("#make-qnty").value);
  return details;
};

/*-----------------------------------------------------------------------------------------
SUBMIT
-----------------------------------------------------------------------------------------*/

const makeSubmit = () => {
  let submission = makeGetDetails();
  axios
    .post("/make/submit", submission)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

/*=========================================================================================
END
=========================================================================================*/
