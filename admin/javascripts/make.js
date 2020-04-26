/* ====================================================
VARIABLES
==================================================== */

let make = {
  initialise: undefined,
  fetch: undefined,
  save: undefined,
  filter: {
    status: undefined,
  },
  html: {
    create: undefined,
    insert: undefined,
    delete: undefined,
  },
};

/* ====================================================
FUNCTIONS
==================================================== */

make.initialise = async () => {
  let makes;
  try {
    makes = await make.fetch();
  } catch (error) {
    console.log(error);
    return;
  }
  const filteredMakes = make.filter.status(makes, "awaitingQuote");
  console.log(filteredMakes);
  try {
    await make.html.insert(filteredMakes);
  } catch (error) {
    console.log(error);
    return;
  }
  return;
};

make.fetch = () => {
  return new Promise(async (resolve, reject) => {
    // Declare the make variable
    let data;
    // Send a get request to fetch the makes
    try {
      data = (await axios.get("/admin/make/fetch"))["data"];
    } catch (error) {
      reject(error);
      return;
    }
    resolve(data.content);
    return;
  });
};

make.save = async (id) => {
  // Get price
  const price = document.querySelector(`#make-price-${id}`).value;
  // Send the update request
  let data;
  try {
    data = (
      await axios.post("/admin/make/update/price", {
        id,
        price,
      })
    )["data"];
  } catch (error) {
    console.log(error);
    return;
  }
  console.log(data);
  return;
};

make.filter.status = (makes, status) => {
  const filteredMakes = makes.filter((make) => {
    return make.status === status;
  });
  return filteredMakes;
};

make.html.create = (make) => {
  return new Promise(async (resolve, reject) => {
    let comment = {
      message: "",
    };
    if (make.comment) {
      // Get comment
      let data;
      try {
        data = (await axios.get(`/admin/comment/fetch/${make.comment}`))[
          "data"
        ];
      } catch (error) {
        reject(error);
        return;
      }
      comment = data.content;
    }
    let price = 0;
    if (make.price) {
      price = make.price;
    }
    const html = `
    <div class="make" id="make-${make._id}">
      <a
        class="make-file"
        href="/files/download/${make.file.id}"
        download
      >${make.file.name}</a>
      <div class="make-process">${make.process}</div>
      <div class="make-material">${make.material}</div>
      <div class="make-quality">${make.quality}</div>
      <div class="make-strength">${make.strength}</div>
      <div class="make-colour">${make.colour}</div>
      <div class="make-comment">${comment.message}</div>
      <input
        type="number"
        id="make-price-${make._id}"
        name="price"
        class="make-price"
        value="${price}"
        min="0"
      />
      <button
        type="button"
        class="make-save"
        onclick="make.save('${make._id}');"
      >Save</button>
    </div>
    `;
    resolve(html);
    return;
  });
};

make.html.insert = (makes) => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < makes.length; i++) {
      let html;
      try {
        html = await make.html.create(makes[i]);
      } catch (error) {
        reject(error);
        return;
      }
      document.querySelector("#makes").insertAdjacentHTML("beforeend", html);
    }
    resolve();
    return;
  });
};

/* ====================================================
END
==================================================== */
