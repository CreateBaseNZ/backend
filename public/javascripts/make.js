/*=========================================================================================
VARIABLES
=========================================================================================*/

let make = {
  // VARIABLES
  currentPage: 0,
  pages: ["upload", "build-type", "build-options", "order-details", "complete"],
  button: {
    upload: {
      next: undefined
    },
    buildType: {
      quick: {
        prototype: undefined,
        mechanical: undefined
      },
      next: undefined
    },
    buildOptions: {
      next: undefined
    },
    orderDetails: {
      next: undefined
    },
    complete: {
      next: undefined
    }
  },
  // FUNCTIONS
  initialise: undefined,
  upload: {
    change: undefined,
    namer: undefined,
    validation: {
      validate: undefined,
      valid: undefined,
      invalid: undefined
    },
    show: undefined
  },
  buildType: {
    change: undefined,
    quick: {
      select: undefined,
      deselect: undefined,
      prototype: {
        select: undefined,
        deselect: undefined,
        set: undefined
      },
      mechanical: {
        select: undefined,
        deselect: undefined,
        set: undefined
      }
    },
    custom: {
      select: undefined,
      deselect: undefined
    },
    validation: {
      validate: undefined,
      valid: undefined,
      invalid: undefined
    },
    next: undefined,
    show: undefined
  },
  buildOptions: {
    material: {
      fdm: ["pla", "abs", "petg"],
      select: undefined,
      deselect: undefined
    },
    quality: {
      selection: ["draft", "normal", "high"],
      select: undefined,
      deselect: undefined
    },
    strength: {
      selection: ["normal", "strong", "solid"],
      select: undefined,
      deselect: undefined
    },
    reset: undefined,
    show: undefined
  },
  orderDetails: {
    show: undefined
  },
  complete: {
    show: undefined
  },
  changePage: undefined
};

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

make.initialise = () => {
  make.button.upload.next = document.querySelector("#make-upload-next");
  make.button.buildType.quick.prototype = document.querySelector(
    "#make-prototype-build-input"
  );
  make.button.buildType.quick.mechanical = document.querySelector(
    "#make-mechanical-build-input"
  );
  make.button.buildType.next = document.querySelector("#make-build-type-next");
};

/*-----------------------------------------------------------------------------------------
UPLOAD
-----------------------------------------------------------------------------------------*/

make.upload.change = file => {
  // Validate the uploaded file
  const data = make.upload.validation.validate(file);
  if (data.valid) {
    // Update the displayed file name
    const name = make.upload.namer(file);
    document.querySelector("#make-file-name").textContent = name;
  } else {
    // Clear file name
    document.querySelector("#make-file").value = "";
    document.querySelector("#make-file-name").textContent = "No File Uploaded";
  }
  document.querySelector("#make-file-error").textContent = data.message;
};

make.upload.namer = file => {
  const name = file.name.split(".")[0];
  const length = name.length;
  let displayName = {
    first: undefined,
    middle: undefined,
    last: undefined
  };
  if (length > 20) {
    displayName = {
      first: name.slice(0, 8),
      middle: " ... ",
      last: name.slice(length - 8)
    };
  } else {
    displayName = {
      first: name,
      middle: "",
      last: ""
    };
  }
  return displayName.first + displayName.middle + displayName.last;
};

make.upload.validation.validate = file => {
  let data = {
    valid: true,
    message: ""
  };
  // Check if there is no file uploaded
  if (!file) {
    data.valid = false;
    data.message = "file is required";
    make.upload.validation.invalid();
    return data;
  }
  // Check if file type is invalid
  const split = file.name.split(".");
  const name = split[0];
  const extension = split[1].toUpperCase();
  if (extension !== "STL" && extension !== "OBJ" && extension !== "3MF") {
    data.valid = false;
    data.message = "invalid file type";
    make.upload.validation.invalid();
    return data;
  }
  make.upload.validation.valid();
  return data;
};

make.upload.validation.valid = () => {
  // Update next button css
  make.button.upload.next.classList.remove("disable");
  // Add event listener
  make.button.upload.next.addEventListener("click", make.buildType.show);
};

make.upload.validation.invalid = () => {
  // Update next button css
  make.button.upload.next.classList.add("disable");
  // Remove event listener
  make.button.upload.next.removeEventListener("click", make.buildType.show);
};

make.upload.show = () => make.changePage(0);

/*-----------------------------------------------------------------------------------------
BUILD TYPE
-----------------------------------------------------------------------------------------*/

make.buildType.change = (type, status) => {
  if (status) {
    if (type === "quick") {
      make.buildType.quick.select();
      make.buildType.custom.deselect();
    } else {
      make.buildType.custom.select();
      make.buildType.quick.deselect();
    }
  }
};

make.buildType.quick.select = () => {
  document.querySelector("#make-quick-build-input").classList.add("select");
  // Enable Quick Build Options
  document.querySelector("#make-quick-build-options").classList.add("select");
  // Add Event Listeners
  make.button.buildType.quick.prototype.addEventListener(
    "click",
    make.buildType.quick.prototype.select
  );
  make.button.buildType.quick.mechanical.addEventListener(
    "click",
    make.buildType.quick.mechanical.select
  );
};

make.buildType.quick.deselect = () => {
  document.querySelector("#make-quick-build-input").classList.remove("select");
  // Disable Quick Build Options
  document
    .querySelector("#make-quick-build-options")
    .classList.remove("select");
  // Reset Quick Build Selections
  document.querySelector("#make-prototype-build").checked = false;
  document.querySelector("#make-mechanical-build").checked = false;
  make.buildType.quick.prototype.deselect();
  make.buildType.quick.mechanical.deselect();
  // Remove Event Listeners
  make.button.buildType.quick.prototype.removeEventListener(
    "click",
    make.buildType.quick.prototype.select
  );
  make.button.buildType.quick.mechanical.removeEventListener(
    "click",
    make.buildType.quick.mechanical.select
  );
};

make.buildType.quick.prototype.select = () => {
  // Update CSS
  make.button.buildType.quick.prototype.classList.add("select");
  // Deselect other selection
  make.buildType.quick.mechanical.deselect();

  make.buildOptions.reset();
};

make.buildType.quick.prototype.deselect = () => {
  make.button.buildType.quick.prototype.classList.remove("select");
};

make.buildType.quick.prototype.set = () => {
  // Pre-Set Inputs
  document.querySelector("#make-fdm-pla-material").checked = true;
  document.querySelector("#make-draft-quality").checked = true;
};

make.buildType.quick.mechanical.select = () => {
  // Update CSS
  make.button.buildType.quick.mechanical.classList.add("select");
  // Deselect other selection
  make.buildType.quick.prototype.deselect();

  make.buildOptions.reset();
};

make.buildType.quick.mechanical.deselect = () => {
  make.button.buildType.quick.mechanical.classList.remove("select");
};

make.buildType.quick.mechanical.set = () => {};

make.buildType.custom.select = () => {
  document.querySelector("#make-custom-build-input").classList.add("select");
};

make.buildType.custom.deselect = () => {
  document.querySelector("#make-custom-build-input").classList.remove("select");
};

make.buildType.validation.validate = () => {
  let data = {
    valid: true,
    message: ""
  };
  // Collect Input
  const build = {
    quick: document.querySelector("#make-quick-build").checked,
    custom: document.querySelector("#make-custom-build").checked,
    prototype: document.querySelector("#make-prototype-build").checked,
    mechanical: document.querySelector("#make-mechanical-build").checked
  };
  // Validation
  if (build.quick) {
    if (!build.prototype && !build.mechanical) {
      data.valid = false;
      data.message = "select a quick build";
      make.buildType.validation.invalid();
      return data;
    }
  } else if (!build.custom) {
    data.valid = false;
    data.message = "select a build type";
    make.buildType.validation.invalid();
    return data;
  }
  make.buildType.validation.valid();
  return data;
};

make.buildType.validation.valid = () => {
  // Update next button css
  make.button.buildType.next.classList.remove("disable");
  // Add event listener
  make.button.buildType.next.addEventListener("click", make.buildType.next);
};

make.buildType.validation.invalid = () => {
  // Update next button css
  make.button.buildType.next.classList.add("disable");
  // Remove event listener
  make.button.buildType.next.removeEventListener("click", make.buildType.next);
};

make.buildType.next = () => {
  // Collect Input
  const build = {
    quick: document.querySelector("#make-quick-build").checked,
    custom: document.querySelector("#make-custom-build").checked,
    prototype: document.querySelector("#make-prototype-build").checked,
    mechanical: document.querySelector("#make-mechanical-build").checked
  };

  if (build.quick) {
    if (build.prototype) {
    } else if (build.mechanical) {
    }
    make.buildOptions.show();
    make.orderDetails.show();
  } else if (build.custom) {
    make.buildOptions.show();
  }
};

make.buildType.show = () => make.changePage(1);

/*-----------------------------------------------------------------------------------------
BUILD OPTIONS
-----------------------------------------------------------------------------------------*/

make.buildOptions.reset = () => {
  // RESET INPUTS AND CSS
  // Material - FDM
  for (let i = 0; i < make.buildOptions.material.fdm.length; i++) {
    const material = make.buildOptions.material.fdm[i];
    // Input
    document.querySelector(`#make-fdm-${material}-material`).checked = false;
    // CSS
    document
      .querySelector(`#make-fdm-${material}-material-input`)
      .classList.remove("select");
  }
  // Quality
  for (let i = 0; i < make.buildOptions.quality.selection.length; i++) {
    const quality = make.buildOptions.quality.selection[i];
    // Input
    document.querySelector(`#make-${quality}-quality`).checked = false;
    // CSS
    document
      .querySelector(`#make-${quality}-quality-input`)
      .classList.remove("select");
  }
  // Strength
  for (let i = 0; i < make.buildOptions.strength.selection.length; i++) {
    const strength = make.buildOptions.strength.selection[i];
    // Input
    document.querySelector(`#make-${strength}-strength`).checked = false;
    // CSS
    document
      .querySelector(`#make-${strength}-strength-input`)
      .classList.remove("select");
  }
};

make.buildOptions.show = () => make.changePage(2);

/*-----------------------------------------------------------------------------------------
ORDER DETAILS
-----------------------------------------------------------------------------------------*/

make.orderDetails.show = () => make.changePage(3);

/*-----------------------------------------------------------------------------------------
COMPLETE
-----------------------------------------------------------------------------------------*/

make.complete.show = () => make.changePage(4);

/*-----------------------------------------------------------------------------------------
NAVIGATION
-----------------------------------------------------------------------------------------*/

make.changePage = nextPage => {
  // Set Page Names
  const pageName = {
    current: make.pages[make.currentPage],
    next: make.pages[nextPage]
  };
  // Validation
  if (make.currentPage === nextPage) {
    // If the same page is being opened
    return;
  }
  // Change Page
  // Hide Current Page
  let hide = {
    current: undefined,
    next: undefined
  };
  if (make.currentPage < nextPage) {
    hide = {
      current: "hide-left",
      next: "hide-right"
    };
  } else {
    hide = {
      current: "hide-right",
      next: "hide-left"
    };
  }
  document
    .querySelector(`#make-${pageName.current}`)
    .classList.add(hide.current);
  // Show Next Page
  document.querySelector(`#make-${pageName.next}`).classList.remove(hide.next);
  // Update Current Page
  make.currentPage = nextPage;
};

/*=========================================================================================
END
=========================================================================================*/
