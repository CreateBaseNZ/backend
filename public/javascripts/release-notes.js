// VARIABLES ================================================

let releaseNotes = {
	init: undefined,
};

// FUNCTIONS ================================================

releaseNotes.init = async function () {
	// Fetch the content data
	let content;
	try {
		content = (await axios.get("/fetch-release-notes"))["data"];
	} catch (error) {
		window.alert("Encountered an error!");
	}
	console.log(content);
};

// END ======================================================
