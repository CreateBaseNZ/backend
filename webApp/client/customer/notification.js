/* -------------------------------
TEST OBJECTS
------------------------------- */

let notifications = [
  {
    id: 1,
    type: "Test",
    text: "This notification is for testing and development",
    date: {
      date: 25,
      month: 11,
      year: 2019,
      hour: 13,
      minute: 12,
      second: 56
    },
    isRead: false,
    read: () => {
      this.isRead = true;
    },
    unread: () => {
      this.isRead = false;
    }
  },
  {
    id: 2,
    type: "Test",
    text: "This notification is for testing and development",
    date: {
      date: 7,
      month: 12,
      year: 2019,
      hour: 9,
      minute: 53,
      second: 39
    },
    isRead: true,
    read: () => {
      this.isRead = true;
    },
    unread: () => {
      this.isRead = false;
    }
  },
  {
    id: 3,
    type: "Test",
    text: "This notification is for testing and development",
    date: {
      date: 20,
      month: 9,
      year: 2019,
      hour: 9,
      minute: 50,
      second: 1
    },
    isRead: true,
    read: () => {
      this.isRead = true;
    },
    unread: () => {
      this.isRead = false;
    }
  }
];

/* -------------------------------
FUNCTIONS
------------------------------- */

// Load notifications to the notification page

let loadNtfs = () => {
  ftchNtfs.then(ntfs => ppltNtfs(ntfs)).catch(err => console.log(err));
};

// Fetch the notifications from the database (TEMP)

let ftchNtfs = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(notifications);
  }, 3000);
});

// Populate the notification page

let ppltNtfs = ntfs => {
  let element = document.querySelector(".ntfs-cntt");
  let html;
  // Check if there's any notification to list
  if (!ntfs) {
    html = "<p>No Notification</p>";
    element.innerHTML = html;
    return;
  }
  // Sort the notifications by date (Asc)
  ntfs.sort(sortNtfsByDateAsc);
  let currDate = moment();
  // List the sorted notifications
  for (let i = 0; i < ntfs.length; i++) {
    listNtf(ntfs[i], currDate);
  }
};

// List the notification to the notification page

let listNtf = (ntf, currDate) => {
  let ntfDate = dateObjToMmnt(ntf.date);
  let diffObj = dateDiffInObj(currDate, ntfDate);
  let dateStr = ntfDateStr(diffObj);
  let ntfUnrd = "ntf-unrd";
  let ntfStngUnrd = "ntf-stng-unrd";
  if (ntf.isRead) {
    ntfUnrd = "";
    ntfStngUnrd = "";
  }
  let html = `<div class="ntf ${ntfUnrd}" id="ntf-${ntf.id}">
                  <div class="ntf-cntn">
                    <div class="ntf-logo-cntn">
                      <img src="" alt="" class="ntf-logo">
                    </div>
                    <div class="ntf-dtls">
                      <p class="ntf-msg txt-1 txt-clr-1">${ntf.text}</p>
                      <p class="ntf-date sbtl-1 txt-clr-2">${dateStr}</p>
                    </div>
                  </div>
                  <div class="ntf-stng">
                    <div class="ntf-stng-rd ${ntfStngUnrd}" id="ntf-stng-rd-${ntf.id}"></div>
                  </div>
                </div>`;
  document.querySelector(".ntfs-cntt").insertAdjacentHTML("afterbegin", html);
  // Add event listeners
  document
    .querySelector(`#ntf-stng-rd-${ntf.id}`)
    .addEventListener("click", () => ntfRdStt(ntf));
};

// Toggle Notification Read Status

let ntfRdStt = ntf => {
  document.querySelector(`#ntf-${ntf.id}`).classList.toggle("ntf-unrd");
  document
    .querySelector(`#ntf-stng-rd-${ntf.id}`)
    .classList.toggle("ntf-stng-unrd");

  ntfUpd(ntf);
};

// Update notification read status

let ntfUpd = ntf => {};

// Notification date string

let ntfDateStr = dateObj => {
  let str;
  if (dateObj.years > 0) {
    str = `${dateObj.years}y`;
  } else if (dateObj.months > 0) {
    str = `${dateObj.months}mo`;
  } else if (dateObj.weeks > 0) {
    str = `${dateObj.weeks}w`;
  } else if (dateObj.days > 0) {
    str = `${dateObj.days}d`;
  } else if (dateObj.hours > 0) {
    str = `${dateObj.hours}h`;
  } else if (dateObj.minutes > 0) {
    str = `${dateObj.minutes}mi`;
  } else {
    str = `${dateObj.seconds}s`;
  }
  return str;
};

// Sort Notifications by Date - Ascending

let sortNtfsByDateAsc = (ntf1, ntf2) => {
  let diff = dateDiff(ntf1.date, ntf2.date);
  // Evaluate
  if (diff > 0) {
    // if notification 1 is older than notification 2
    return 1;
  } else if (diff < 0) {
    // if notification 1 is newer than notification 2
    return -1;
  } else {
    // if notifications 1 and 2 are equal
    return 0;
  }
};
