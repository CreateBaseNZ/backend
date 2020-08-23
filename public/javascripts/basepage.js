const basePageInit = async () => {
    updateSessionPage();
    // LOAD SYSTEM
    try {
      await global.initialise();
    } catch (error) {
      return console.log(error);
    }
    // REMOVE STARTUP LOADER
    removeLoader();
  }