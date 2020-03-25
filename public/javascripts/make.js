/*=========================================================================================
VARIABLES
=========================================================================================*/

let make = {
  // VARIABLES
  currentPage: 0,
  pages: ["upload", "build-type", "build-options", "order-details", "complete"],
  materials: {
    fdm: ["pla", "abs", "petg"]
  },
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
  heading: {
    upload: undefined,
    buildType: undefined,
    buildOptions: undefined,
    orderDetails: undefined,
    complete: undefined
  },
  // FUNCTIONS
  initialise: undefined,
  collect: undefined,
  inspect: undefined,
  submit: undefined,
  validate: undefined,
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
    reset: undefined,
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
    validation: {
      validate: undefined,
      valid: undefined,
      invalid: undefined
    },
    reset: undefined,
    show: undefined
  },
  orderDetails: {
    colour: {
      selection: {
        pla: ["any", "white", "black"],
        abs: ["any", "white", "black"],
        petg: ["any", "white", "black"]
      },
      select: undefined,
      deselect: undefined,
      reset: undefined,
      show: undefined
    },
    quantity: {
      value: undefined,
      add: undefined,
      subtract: undefined,
      change: undefined
    },
    validation: {
      validate: undefined,
      valid: undefined,
      invalid: undefined
    },
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
  // Buttons
  make.button.upload.next = document.querySelector("#make-upload-next");
  make.button.buildType.quick.prototype = document.querySelector(
    "#make-prototype-build-input"
  );
  make.button.buildType.quick.mechanical = document.querySelector(
    "#make-mechanical-build-input"
  );
  make.button.buildType.next = document.querySelector("#make-build-type-next");
  make.button.buildOptions.next = document.querySelector(
    "#make-build-options-next"
  );
  make.button.orderDetails.next = document.querySelector(
    "#make-order-details-next"
  );
  // Headings
  make.heading.upload = document.querySelector("#make-upload-heading");
  make.heading.buildType = document.querySelector("#make-build-type-heading");
  make.heading.buildOptions = document.querySelector(
    "#make-build-options-heading"
  );
  make.heading.orderDetails = document.querySelector(
    "#make-order-details-heading"
  );
  make.heading.complete = document.querySelector("#make-complete-heading");
};

make.collect = () => {
  let input = new FormData(document.querySelector("#make-inputs"));
  const quantity = document.querySelector("#make-quantity").value;
  input.append("quantity", quantity);
  const note = document.querySelector("#make-note").value;
  input.append("note", note);
  return input;
};

make.inspect = () => {
  const input = make.collect();
  for (let pair of input.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
};

make.submit = async () => {
  // Validate Inputs
  const validation = make.validate();
  if (!validation.valid) {
    console.log(validation.message);
    return;
  }
  // Collect Inputs
  const input = make.collect();
  // Save Input
  let data;
  try {
    data = (await axios.post("/make/submit", input))["data"];
  } catch (error) {
    console.log(error); // TEMPORARY (error handling placeholder)
    return;
  }
  // Redirection Page
  console.log(data);
};

make.validate = () => {
  data = {
    valid: false,
    message: ""
  };
  // Upload
  let upload = make.upload.validation.validate();
  if (!upload.valid) {
    data.message = upload.message;
    return data;
  }
  // Build Type
  let buildType = make.buildType.validation.validate();
  if (!buildType.valid) {
    data.message = buildType.message;
    return data;
  }
  // Build Options
  let buildOptions = make.buildOptions.validation.validate();
  if (!buildOptions.valid) {
    data.message = buildType.message;
    return data;
  }
  // Order Details
  let orderDetails = make.orderDetails.validation.validate();
  if (!orderDetails.valid) {
    data.message = orderDetails.message;
    return data;
  }
  // Return Success
  data.valid = true;
  return data;
};

/*-----------------------------------------------------------------------------------------
UPLOAD
-----------------------------------------------------------------------------------------*/

make.upload.change = () => {
  // Get File Input
  const input = make.collect();
  const file = input.get("file");
  // Validate the uploaded file
  const data = make.upload.validation.validate();
  if (data.valid) {
    // Update the displayed file name
    const name = make.upload.namer(file.name);
    document.querySelector("#make-file-name").textContent = name;
  } else {
    // Clear file name
    document.querySelector("#make-file").value = "";
    document.querySelector("#make-file-name").textContent = "No File Uploaded";
  }
  document.querySelector("#make-file-error").textContent = data.message;
};

make.upload.namer = name => {
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

make.upload.validation.validate = () => {
  // Get File Input
  const input = make.collect();
  const file = input.get("file");
  // Initialise
  let data = {
    valid: true,
    message: ""
  };
  // Check if there is no file uploaded
  if (!file.name) {
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
  document.querySelector("#make-build-type").classList.remove("disable");
  make.button.upload.next.classList.remove("disable");
  // Add event listener
  make.button.upload.next.addEventListener("click", make.buildType.show);
  make.heading.buildType.addEventListener("click", make.buildType.show);
};

make.upload.validation.invalid = () => {
  // Update next button css
  document.querySelector("#make-build-type").classList.add("disable");
  make.button.upload.next.classList.add("disable");
  // Remove event listener
  make.button.upload.next.removeEventListener("click", make.buildType.show);
  make.heading.buildType.removeEventListener("click", make.buildType.show);
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
  // Reset Build Options
  make.buildOptions.reset();
  // Set Build Options
  make.buildType.quick.prototype.set();
};

make.buildType.quick.prototype.deselect = () => {
  make.button.buildType.quick.prototype.classList.remove("select");
};

make.buildType.quick.prototype.set = () => {
  // Pre-Set Inputs
  document.querySelector("#make-fdm-pla-material").checked = true;
  make.orderDetails.colour.show("fdm", "pla");
  document.querySelector("#make-draft-quality").checked = true;
  document.querySelector("#make-normal-strength").checked = true;
  // Edit CSS
  document
    .querySelector("#make-fdm-pla-material-input")
    .classList.add("select");
  document.querySelector("#make-draft-quality-input").classList.add("select");
  document.querySelector("#make-normal-strength-input").classList.add("select");
  // Validate Build Options
  make.buildOptions.validation.validate();
};

make.buildType.quick.mechanical.select = () => {
  // Update CSS
  make.button.buildType.quick.mechanical.classList.add("select");
  // Deselect other selection
  make.buildType.quick.prototype.deselect();
  // Reset Build Options
  make.buildOptions.reset();
  // Set Build Options
  make.buildType.quick.mechanical.set();
};

make.buildType.quick.mechanical.deselect = () => {
  make.button.buildType.quick.mechanical.classList.remove("select");
};

make.buildType.quick.mechanical.set = () => {
  // Pre-Set Inputs
  document.querySelector("#make-fdm-petg-material").checked = true;
  make.orderDetails.colour.show("fdm", "petg");
  document.querySelector("#make-normal-quality").checked = true;
  document.querySelector("#make-strong-strength").checked = true;
  // Edit CSS
  document
    .querySelector("#make-fdm-petg-material-input")
    .classList.add("select");
  document.querySelector("#make-normal-quality-input").classList.add("select");
  document.querySelector("#make-strong-strength-input").classList.add("select");
  // Validate Build Options
  make.buildOptions.validation.validate();
};

make.buildType.custom.select = () => {
  document.querySelector("#make-custom-build-input").classList.add("select");
  // Reset Build Options
  make.buildOptions.reset();
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
  document.querySelector("#make-build-options").classList.remove("disable");
  make.button.buildType.next.classList.remove("disable");
  // Add event listener
  make.button.buildType.next.addEventListener("click", make.buildType.next);
  make.heading.buildOptions.addEventListener("click", make.buildOptions.show);
};

make.buildType.validation.invalid = () => {
  // Update next button css
  document.querySelector("#make-build-options").classList.add("disable");
  make.button.buildType.next.classList.add("disable");
  // Remove event listener
  make.button.buildType.next.removeEventListener("click", make.buildType.next);
  make.heading.buildOptions.removeEventListener(
    "click",
    make.buildOptions.show
  );
};

make.buildType.reset = () => {
  // Reset Input Values
  document.querySelector("#make-quick-build").checked = false;
  document.querySelector("#make-custom-build").checked = false;
  document.querySelector("#make-prototype-build").checked = false;
  document.querySelector("#make-mechanical-build").checked = false;
  // Reset CSS Values
  document.querySelector("#make-quick-build-input").classList.remove("select");
  document.querySelector("#make-custom-build-input").classList.remove("select");
  document
    .querySelector("#make-prototype-build-input")
    .classList.remove("select");
  document
    .querySelector("#make-mechanical-build-input")
    .classList.remove("select");
  make.buildType.validation.validate();
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
    make.orderDetails.show();
  } else if (build.custom) {
    make.buildOptions.show();
  }
};

make.buildType.show = () => make.changePage(1);

/*-----------------------------------------------------------------------------------------
BUILD OPTIONS
-----------------------------------------------------------------------------------------*/

make.buildOptions.material.select = (process, material) => {
  // RESET CSS
  // FDM
  for (let i = 0; i < make.buildOptions.material.fdm.length; i++) {
    document
      .querySelector(
        `#make-fdm-${make.buildOptions.material.fdm[i]}-material-input`
      )
      .classList.remove("select");
  }
  // Set CSS
  document
    .querySelector(`#make-${process}-${material}-material-input`)
    .classList.add("select");
  // Change Build Type to Custom
  make.buildType.reset();
  document.querySelector("#make-custom-build").checked = true;
  document.querySelector("#make-custom-build-input").classList.add("select");
  // Validate
  make.buildType.validation.validate();
  make.buildOptions.validation.validate();
  // Show Colours
  make.orderDetails.colour.show(process, material);
};

make.buildOptions.quality.select = quality => {
  // RESET CSS
  for (let i = 0; i < make.buildOptions.quality.selection.length; i++) {
    document
      .querySelector(
        `#make-${make.buildOptions.quality.selection[i]}-quality-input`
      )
      .classList.remove("select");
  }
  // Set CSS
  document
    .querySelector(`#make-${quality}-quality-input`)
    .classList.add("select");
  // Change Build Type to Custom
  make.buildType.reset();
  document.querySelector("#make-custom-build").checked = true;
  document.querySelector("#make-custom-build-input").classList.add("select");
  // Validate
  make.buildType.validation.validate();
  make.buildOptions.validation.validate();
};

make.buildOptions.strength.select = strength => {
  // RESET CSS
  for (let i = 0; i < make.buildOptions.strength.selection.length; i++) {
    document
      .querySelector(
        `#make-${make.buildOptions.strength.selection[i]}-strength-input`
      )
      .classList.remove("select");
  }
  // Set CSS
  document
    .querySelector(`#make-${strength}-strength-input`)
    .classList.add("select");
  // Change Build Type to Custom
  make.buildType.reset();
  document.querySelector("#make-custom-build").checked = true;
  document.querySelector("#make-custom-build-input").classList.add("select");
  // Validate
  make.buildType.validation.validate();
  make.buildOptions.validation.validate();
};

make.buildOptions.validation.validate = () => {
  // Initialise Variables
  let data = {
    valid: true,
    message: ""
  };
  // Collect Inputs
  let material = false;
  for (let i = 0; i < make.buildOptions.material.fdm.length; i++) {
    if (
      document.querySelector(
        `#make-fdm-${make.buildOptions.material.fdm[i]}-material`
      ).checked
    ) {
      material = true;
    }
  }
  let quality = false;
  for (let i = 0; i < make.buildOptions.quality.selection.length; i++) {
    if (
      document.querySelector(
        `#make-${make.buildOptions.quality.selection[i]}-quality`
      ).checked
    ) {
      quality = true;
    }
  }
  let strength = false;
  for (let i = 0; i < make.buildOptions.strength.selection.length; i++) {
    if (
      document.querySelector(
        `#make-${make.buildOptions.strength.selection[i]}-strength`
      ).checked
    ) {
      strength = true;
    }
  }
  // Validation Processes
  if (!material) {
    data.valid = false;
    data.message = "choose a material";
    make.buildOptions.validation.invalid();
    return data;
  } else if (!quality) {
    data.valid = false;
    data.message = "specify quality";
    make.buildOptions.validation.invalid();
    return data;
  } else if (!strength) {
    data.valid = false;
    data.message = "specify strength";
    make.buildOptions.validation.invalid();
    return data;
  }
  // Return
  make.buildOptions.validation.valid();
  return data;
};

make.buildOptions.validation.valid = () => {
  // Update next button css
  document.querySelector("#make-order-details").classList.remove("disable");
  make.button.buildOptions.next.classList.remove("disable");
  // Add Event Listener
  make.button.buildOptions.next.addEventListener(
    "click",
    make.orderDetails.show
  );
  make.heading.orderDetails.addEventListener("click", make.orderDetails.show);
};

make.buildOptions.validation.invalid = () => {
  // Update next button css
  document.querySelector("#make-order-details").classList.add("disable");
  make.button.buildOptions.next.classList.add("disable");
  // Remove Event Listener
  make.button.buildOptions.next.removeEventListener(
    "click",
    make.orderDetails.show
  );
  make.heading.orderDetails.removeEventListener(
    "click",
    make.orderDetails.show
  );
};

make.buildOptions.reset =
  // Set Build Options
  () => {
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
    // Validate
    make.buildOptions.validation.validate();
  };

make.buildOptions.show = () => make.changePage(2);

/*-----------------------------------------------------------------------------------------
ORDER DETAILS
-----------------------------------------------------------------------------------------*/

make.orderDetails.colour.select = (process, material, colour) => {
  // Reset all input selections
  make.orderDetails.colour.reset();
  // Update CSS
  document
    .querySelector(`#make-${material}-${colour}-colour-input`)
    .classList.add("select");
  // Set input
  document.querySelector(`#make-${material}-${colour}-colour`).checked = true;
  make.orderDetails.validation.validate();
};

make.orderDetails.colour.deselect = (process, material, colour) => {
  // Update CSS
  document
    .querySelector(`#make-${material}-${colour}-colour-input`)
    .classList.remove("select");
};

make.orderDetails.colour.reset = () => {
  // FDM Materials
  for (let i = 0; i < make.materials.fdm.length; i++) {
    const material = make.materials.fdm[i];
    for (
      let i = 0;
      i < make.orderDetails.colour.selection[material].length;
      i++
    ) {
      const colour = make.orderDetails.colour.selection[material][i];
      make.orderDetails.colour.deselect("fdm", material, colour);
      document.querySelector(
        `#make-${material}-${colour}-colour`
      ).checked = false;
    }
  }
};

make.orderDetails.colour.show = (process, material) => {
  // Reset all input selections
  make.orderDetails.colour.reset();
  // Hide all colours
  // FDM Materials
  for (let i = 0; i < make.materials.fdm.length; i++) {
    const material = make.materials.fdm[i];
    document
      .querySelector(`#make-${material}-colours`)
      .classList.add("hide-element");
  }
  // Show colours for selected material
  document
    .querySelector(`#make-${material}-colours`)
    .classList.remove("hide-element");
};

make.orderDetails.quantity.add = () => {
  let value = Number(document.querySelector("#make-quantity").value);
  document.querySelector("#make-quantity").value = value + 1;
  make.orderDetails.quantity.value = value + 1;
  document.querySelector("#make-quantity-subtract").classList.remove("disable");
  make.orderDetails.validation.validate();
};

make.orderDetails.quantity.subtract = () => {
  let value = Number(document.querySelector("#make-quantity").value);
  if (value === 0) {
    return;
  }
  document.querySelector("#make-quantity").value = value - 1;
  make.orderDetails.quantity.value = value - 1;
  if (value - 1 === 0) {
    document.querySelector("#make-quantity-subtract").classList.add("disable");
  }
  make.orderDetails.validation.validate();
};

make.orderDetails.quantity.change = quantity => {
  if (quantity < 0) {
    document.querySelector("#make-quantity").value =
      make.orderDetails.quantity.value;
    return;
  }
  make.orderDetails.quantity.value = quantity;
  if (quantity === 0) {
    document.querySelector("#make-quantity-subtract").classList.add("disable");
  }
  make.orderDetails.validation.validate();
};

make.orderDetails.validation.validate = () => {
  // Initialise Variables
  let data = {
    valid: true,
    message: ""
  };
  // Collect Inputs
  let colourBool = false;
  // Colour - FDM
  for (let i = 0; i < make.materials.fdm.length; i++) {
    const material = make.materials.fdm[i];
    for (
      let i = 0;
      i < make.orderDetails.colour.selection[material].length;
      i++
    ) {
      const colour = make.orderDetails.colour.selection[material][i];
      if (
        document.querySelector(`#make-${material}-${colour}-colour`).checked
      ) {
        colourBool = true;
      }
    }
  }
  // Quantity
  let quantity = false;
  if (document.querySelector("#make-quantity").value > 0) {
    quantity = true;
  }
  // Validation Processes
  if (!colourBool) {
    data.valid = false;
    data.message = "choose a colour";
    make.orderDetails.validation.invalid();
    return data;
  } else if (!quantity) {
    data.valid = false;
    data.message = "requires quantity";
    make.orderDetails.validation.invalid();
    return data;
  }
  // Return
  make.orderDetails.validation.valid();
  return data;
};

make.orderDetails.validation.valid = () => {
  // Update next button css
  document.querySelector("#make-complete").classList.remove("disable");
  make.button.orderDetails.next.classList.remove("disable");
  // Add Event Listener
  make.button.orderDetails.next.addEventListener("click", make.complete.show);
  make.heading.complete.addEventListener("click", make.complete.show);
};

make.orderDetails.validation.invalid = () => {
  // Update next button css
  document.querySelector("#make-complete").classList.add("disable");
  make.button.orderDetails.next.classList.add("disable");
  // Add Event Listener
  make.button.orderDetails.next.removeEventListener(
    "click",
    make.complete.show
  );
  make.heading.complete.removeEventListener("click", make.complete.show);
};

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
  const nextPageName = make.pages[nextPage];
  // Validation
  if (make.currentPage === nextPage) {
    // If the same page is being opened
    return;
  }
  // Change Page
  // Hide Current Page and Show Next Page
  if (make.currentPage < nextPage) {
    for (let i = make.currentPage; i < nextPage; i++) {
      const pageName = make.pages[i];
      document
        .querySelector(`#make-${pageName}`)
        .classList.remove("hide-right");
      document.querySelector(`#make-${pageName}`).classList.add("hide-left");
    }
    document
      .querySelector(`#make-${nextPageName}`)
      .classList.remove("hide-right");
  } else {
    for (let i = nextPage + 1; i <= make.currentPage; i++) {
      const pageName = make.pages[i];
      document.querySelector(`#make-${pageName}`).classList.remove("hide-left");
      document.querySelector(`#make-${pageName}`).classList.add("hide-right");
    }
    document
      .querySelector(`#make-${nextPageName}`)
      .classList.remove("hide-left");
  }
  // Update Current Page
  make.currentPage = nextPage;
};

/*=========================================================================================
END
=========================================================================================*/
