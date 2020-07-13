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
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  addListener: undefined,
  fetchDetails: undefined,
  populateDetails: undefined,
  saveDetails: undefined,
  uploadPicture: undefined
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
  dashboard.wrapper = document.querySelector('.profile-wrapper');
  dashboard.dpEl = document.getElementById('profile-preview');
  dashboard.nameEl = document.getElementById('profile-name');
  dashboard.locationEl = document.getElementById('profile-location');
  dashboard.bioEl = document.getElementById('profile-bio');
}

// @func  dashboard.addListener
// @desc  
dashboard.addListener = () => {
  // -- If edit --
  document.getElementById('profile-edit-btn').addEventListener('click', () => {
    dashboard.wrapper.classList.toggle('profile-wrapper-edit');
  });

  //  -- If save --
  document.getElementById('profile-save-btn').addEventListener('click', async () => {
    dashboard.wrapper.classList.toggle('profile-wrapper-edit');

    // Update profile pictures in nav bar
    dpTemp = dashboard.dpEl.src;
    for (var i = 0; i < profile.allDP.length; i++) {
      console.log(profile.allDP[i])
      profile.allDP[i].src = dpTemp;
    }
    // Save new variables
    dashboard.saveDetails();
  });

  // -- If cancel --
  document.getElementById('profile-cancel-btn').addEventListener('click', () => {
    // Revert all changes back to variables
    dashboard.nameEl.innerHTML = nameTemp;
    dashboard.locationEl.innerHTML = location;
    dashboard.bioEl.innerHTML = bioTemp;
    dashboard.wrapper.classList.toggle('profile-wrapper-edit');
    dashboard.dpEl.src = dpTemp;
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
  var nameTemp = customerInfo["displayName"];
  var bioTemp = customerInfo["bio"];
  var dpTemp = dashboard.dpEl.src;
  let location = 'auckland, new zealand';

  // -- Update all markup (display + edit) --
  dashboard.nameEl.innerHTML = nameTemp
  dashboard.locationEl.innerHTML = location
  dashboard.bioEl.innerHTML = bioTemp
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

/* ========================================================================================
END
======================================================================================== */