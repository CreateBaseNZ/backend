/* ========================================================================================
VARIABLES
======================================================================================== */

let dashboard = {
  // VARIABLES
  wrapper: undefined,
  dpEl: undefined,
  nameEl: undefined,
  locationEl: undefined,
  bioEl: undefined,
  nameTemp: undefined,
  bioTemp: undefined,
  dpTemp: undefined,
  locationTemp: undefined,
  allDP: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  addListener: undefined,
  fetchDetails: undefined,
  populateDetails: undefined,
  previewImage: undefined,
  saveDetails: undefined,
  uploadPicture: undefined,
  save: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  dashboard.initialise
// @desc  
dashboard.initialise = async () => {
  dashboard.declareVariables();
  let customerInfo;
  try {
    customerInfo = await dashboard.fetchDetails();
  } catch (empty) {
    return;
  }
  dashboard.populateDetails(customerInfo);
  dashboard.addListener();
}

// @func  dashboard.declareVariables
// @desc  
dashboard.declareVariables = () => {
  dashboard.wrapper = document.querySelector('.db-profile-wrapper');
  dashboard.dpEl = document.getElementById('profile-preview');
  dashboard.nameEl = document.getElementById('profile-name');
  dashboard.locationEl = document.getElementById('profile-location');
  dashboard.bioEl = document.getElementById('profile-bio');
  dashboard.allDP = [
    document.getElementById('nav-dp'),
    document.getElementById('nav-user-in'),
    document.getElementById('nav-profile-img')
  ];
}

// @func  dashboard.addListener
// @desc  
dashboard.addListener = () => {
  // -- If edit --
  document.getElementById('profile-edit-btn-mobile').addEventListener('click', () => {
    dashboard.wrapper.classList.toggle('db-profile-wrapper-edit');
  });
  document.getElementById('profile-edit-btn-dsktp').addEventListener('click', () => {
    dashboard.wrapper.classList.toggle('db-profile-wrapper-edit');
  });

  //  -- If save --
  document.getElementById('profile-save-btn').addEventListener('click', async () => {
    // Toggle off edit mode
    dashboard.wrapper.classList.toggle('db-profile-wrapper-edit');

    // Update profile pictures in nav bar
    dpTemp = dashboard.dpEl.src;
    for (var i = 0; i < dashboard.allDP.length; i++) {
      console.log(dashboard.allDP[i])
      dashboard.allDP[i].src = dpTemp;
    }
    // Save new variables
    // dashboard.saveDetails();
  });

  // -- If cancel --
  document.getElementById('profile-cancel-btn').addEventListener('click', () => {
    // Revert all changes back to variables
    dashboard.nameEl.innerHTML = dashboard.nameTemp;
    dashboard.bioEl.innerHTML = dashboard.bioTemp;
    dashboard.dpEl.src = dashboard.dpTemp;
    dashboard.wrapper.classList.toggle('db-profile-wrapper-edit');
  });
}

// @func  dashboard.fetchDetails
// @desc  
dashboard.fetchDetails = () => {
  return new Promise(async (resolve, reject) => {
    // -- Get customer info --
    let data;
    try {
      data = (await axios.get("/profile/dashboard/fetch-details"))["data"];
    } catch (error) {
      data = { status: "error", content: error };
    }
    if (data.status === "error") {
      // TO DO .....
      // ERROR HANDLER
      // TO DO .....
      console.log(data.content); // TEMPORARY
      return reject();
    } else if (data.status === "failed") {
      // TO DO .....
      // FAILED HANDLER
      // TO DO .....
      console.log(data.content); // TEMPORARY
      return reject();
    }
    // SUCCESS HANDLER
    return resolve(data.content);
  });
}

// @func  dashboard.populateDetails
// @desc  
dashboard.populateDetails = (customerInfo) => {
  console.log(customerInfo)
  dashboard.nameEl.innerHTML = customerInfo["displayName"];
  dashboard.locationEl.innerHTML = customerInfo["address"]["city"] + ', ' + customerInfo["address"]["country"];
  dashboard.bioEl.innerHTML = customerInfo["bio"];

  // -- Update temp variables --
  dashboard.nameTemp = dashboard.nameEl.innerHTML
  dashboard.bioTemp = dashboard.bioEl.innerHTML
  dashboard.dpTemp = dashboard.dpEl.src
  // creation date
  const date = moment(customerInfo.date.created).format("MMM YYYY");
  document.querySelector("#profile-account-creation-date").innerHTML = date;
}

// @func  dashboard.previewImage
dashboard.previewImage = (event) => {
  console.log(event.target.files[0])
  document.getElementById('profile-preview').src = URL.createObjectURL(event.target.files[0])
}

// @func  dashboard.saveDetails
// @desc  
dashboard.saveDetails = async () => {
  // COLLECT DETAILS
  const customerInfo = {
    displayName: dashboard.nameEl.innerHTML,
    bio: dashboard.bioEl.innerHTML
  }

  // SEND REQUEST
  let data;
  try {
    data = (await axios.post("/profile/customer/update", customerInfo))
  } catch (error) {
    data = { status: "error", content: error };
  }
  if (data.status === "error") {
    // TO DO .....
    // ERROR HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  } else if (data.status === "failed") {
    // TO DO .....
    // FAILED HANDLER
    // TO DO .....
    console.log(data.content); // TEMPORARY
    return;
  }

  // -- Update temp variables --
  dashboard.nameTemp = dashboard.nameEl.innerHTML
  dashboard.bioTemp = dashboard.bioEl.innerHTML
  dashboard.dpTemp = dashboard.dpEl.src;
}

// @func  dashboard.uploadPicture
// @desc  
dashboard.uploadPicture = async () => {
  const file = new FormData(document.querySelector("#profile-pic"));
  let data;
  try {
    data = (await axios.post("/profile/customer/update/picture", file))["data"];
  } catch (error) {
    console.log(error);
    return;
  }
}

// @func  dashboard.save
// @desc  
dashboard.save = async () => {
  // UPLOADED IMAGE
  let input;
  const file = document.getElementById("profile-upload");
  if (file.files.length !== 0) {
    input = await global.compressImage("profile-pic", "picture", 400);
  } else {
    input = new FormData();
  }
  // OTHER INPUTS
  input.append("displayName", dashboard.nameEl.innerHTML);
  input.append("bio", dashboard.bioEl.innerHTML);
  // SUBMIT REQUEST
  let data;
  try {
    data = (await axios.post("/profile/dashboard/save", input))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // FAILED AND ERROR HANDLER
  if (data.status === "failed") {
    console.log(data.content);
    return;
  } else if (data.status === "error") {
    console.log(data.content);
    return;
  }
  // SUCCESS HANDLER
  console.log(data.content);
  // -- Update temp variables --
  dashboard.nameTemp = dashboard.nameEl.innerHTML
  dashboard.bioTemp = dashboard.bioEl.innerHTML
  dashboard.dpTemp = dashboard.dpEl.src
  return;
}

/* ========================================================================================
END
======================================================================================== */