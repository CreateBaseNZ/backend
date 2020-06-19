/* ========================================================================================
VARIABLES
======================================================================================== */

let team = {
  // VARIABLES
  mediaQuery: undefined,
  landscape: undefined,
  numberOfMembers: undefined,
  members: undefined,
  // FUNCTIONS
  initialise: undefined,
  declareVariables: undefined,
  addImages: undefined,
  animateProfiles: undefined
}

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  team.initialise
// @desc  
team.initialise = async () => {
  window.onbeforeunload = () => window.scrollTo(0, 0);
  // DECLARE VARIABLES
  team.declareVariables();
  // LOAD GLOBAL
  try {
    await global.initialise();
  } catch (error) {
    return console.log(error);
  }
  // LOAD NAVIGATION
  try {
    await navigation.initialise();
  } catch (error) {
    return console.log(error);
  }
  // ADD IMAGES
  try {
    await team.addImages();
  } catch (error) {
    return console.log(error);
  }
  // REMOVE STARTUP LOADER
  removeLoader();
  // LOAD SESSION
  session.initialise();
}

// @func  team.declareVariables
// @desc  
team.declareVariables = () => {
  team.mediaQuery = window.matchMedia("(min-width: 850px)");
  team.landscape = window.innerWidth > window.innerHeight;
  team.numberOfMembers = 6;
}

// @func  team.addImages
// @desc  
team.addImages = () => {
  return new Promise(async (resolve, reject) => {
    // IMAGES
    const image1 = {
      src: "/public/images/team/carl.png", id: "",
      alt: "", classes: ["indiv-photo"], parentId: "indiv-photo-carl-default"
    };
    const image2 = {
      src: "/public/images/team/carlos.png", id: "",
      alt: "", classes: ["indiv-photo"], parentId: "indiv-photo-carlos-default"
    }
    const image3 = {
      src: "/public/images/team/louis.png", id: "",
      alt: "", classes: ["indiv-photo"], parentId: "indiv-photo-louis-default"
    }
    const image4 = {
      src: "/public/images/team/hyesu.png", id: "",
      alt: "", classes: ["indiv-photo"], parentId: "indiv-photo-hyesu-default"
    }
    const image5 = {
      src: "/public/images/team/brad.jpg", id: "",
      alt: "", classes: ["indiv-photo"], parentId: "indiv-photo-brad-default"
    }
    const image6 = {
      src: "/public/images/team/brydon.jpg", id: "",
      alt: "", classes: ["indiv-photo"], parentId: "indiv-photo-brydon-default"
    }
    // LOAD IMAGES
    const objects = [image1, image2, image3, image4, image5, image6];
    try {
      await imageLoader(objects);
    } catch (error) {
      reject(error)
    }
    // SUCCESS RESPONSE
    // Animate Profile
    team.members = {};
    for (var i = 0; i < team.numberOfMembers; i++) {
      team.members[i] = document.querySelector('.profile-section').children[i].children
    }
    team.animateProfiles();
    team.mediaQuery.addListener(team.animateProfiles);
    resolve();
  });
}

// @func  team.animateProfiles
// @desc  
team.animateProfiles = () => {
  if (team.mediaQuery.matches && team.landscape) {

    // On desktop, 3 profiles per row
    var row = 3
    // Each position is in increments of 0.55
    var inc = 0.55

    window.addEventListener("scroll", function () {
      var pos = this.scrollY / document.documentElement.clientHeight
      if (pos == 0) {
        for (var i = 0; i < team.numberOfMembers; i++) {
          for (var j = 1; j <= 3; j++) {
            team.members[i][j].style.display = 'none'
          }
        }
      } else if (pos > inc) {
        var ind = (Math.floor((pos / inc)) - 1) * row
        for (var i = ind; i < Math.min(ind + row, team.numberOfMembers); i++) {
          for (var j = 1; j <= 3; j++) {
            team.members[i][j].style.display = 'block'
          }
        }
      }
    });

    // -- Mobile --
  } else {

    // On mobile, 2 profiles per row
    var row = 2
    // Each position is in increments of 0.45
    var inc = 0.45

    window.addEventListener("scroll", function () {
      var pos = this.scrollY / document.documentElement.clientHeight
      if (pos == 0) {
        for (var i = 0; i < team.numberOfMembers; i++) {
          for (var j = 1; j <= 3; j++) {
            team.members[i][j].style.display = 'none'
          }
        }
      } else if (pos > inc) {
        var ind = (Math.floor((pos / inc)) - 1) * row
        for (var i = ind; i < Math.min(ind + row, team.numberOfMembers); i++) {
          for (var j = 1; j <= 3; j++) {
            team.members[i][j].style.display = 'block'
          }
        }
      }
    });
  }
}

/* ========================================================================================
END
======================================================================================== */
