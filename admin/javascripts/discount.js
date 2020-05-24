let discount = {
  initialise: undefined,
  load: undefined,
  fetch: undefined,
  insert: undefined,
  collect: undefined,
  create: undefined
}

discount.initialise = () => {
  discount.load();
}

discount.load = async () => {
  // FETCH
  let discounts;
  try {
    discounts = await discount.fetch();
  } catch (error) {
    return console.log(error);
  }
  // INSERT
  for (let i = 0; i < discounts.length; i++) {
    discount.insert(discounts[i]);
  }
  // SUCCESS HANDLER
  return;
}

discount.fetch = () => {
  return new Promise(async (resolve, reject) => {
    // FETCH
    let data;
    try {
      data = (await axios.get("/admin/discount/fetch"))["data"];
    } catch (error) {
      return reject(error);
    }
    // ERROR HANDLER
    if (data.status === "failed") return reject(data.content);
    // SUCCESS HANDLER
    return resolve(data.content);
  })
}

discount.insert = (object) => {
  // CREATE HTML
  html = `
  <div class="discount">
    <div class="field"><h3>Name:</h3><p>${object.name}</p></div>
    <div class="field"><h3>Code:</h3><p>${object.code}</p></div>
    <div class="field"><h3>Rate:</h3><p>${object.rate}</p></div>
    <div class="field"><h3>Duration Type:</h3><p>${object.duration.type}</p></div>
    <div class="field"><h3>Start Date:</h3><p>${object.duration.start}</p></div>
    <div class="field"><h3>End Date:</h3><p>${object.duration.end}</p></div>
    <div class="field"><h3>Audience Type:</h3><p>${object.audience.type}</p></div>
  </div>
  `;
  // SUCCESS HANDLER
  return document.querySelector("#discounts").insertAdjacentHTML("afterbegin", html);
}

discount.collect = () => {
  const form = document.querySelector("#discount-form");
  const formData = new FormData(form);
  // CREATE THE PROPERTY OBJECT
  let properties = {};
  for (const [property, value] of formData.entries()) {
    properties[property] = value;
  }
  return properties;
}

discount.create = async () => {
  // COLLECT
  const properties = discount.collect();
  // PROCESS
  let data;
  try {
    data = (await axios.post("/admin/discount/create", properties))["data"];
  } catch (error) {
    return console.log(error);
  }
  // ERROR HANDLER
  if (data.status === "failed") return console.log(data.content);
  // SUCCESS HANDLER
  return discount.insert(data.content);
}