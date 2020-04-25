/* ====================================================
VARIABLES
==================================================== */

let make = {
  initialise: undefined,
  fetch: undefined,
  filter: {
    status: undefined,
  },
};

/* ====================================================
FUNCTIONS
==================================================== */

make.initialise = async () => {};

make.fetch = () => {
  return new Promise(async (resolve, reject) => {
    // Declare the make variable
    let makes;
    // Send a get request to fetch the makes
    try {
      makes = (await axios.get("/admin/make/fetch"))["data"];
    } catch (error) {
      reject(error);
      return;
    }
    resolve(makes);
    return;
  });
};

make.filter.status = (makes, status) => {
  const filteredMakes = makes.filter((make) => {
    return make.status === status;
  });
  return filteredMakes;
};

/* ====================================================
END
==================================================== */
