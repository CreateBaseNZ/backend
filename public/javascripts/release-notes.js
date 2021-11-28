// VARIABLES ================================================

let releaseNotes = {
	init: undefined,
	populateData: undefined,

	elem: {
		releaseNoteSection: document.querySelector(".notes-content"),
		versionListContainer: document.querySelector(".release-menu-container"),
	},
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
	// console.log(content);

	releaseNotes.populateData(content);
};

releaseNotes.populateData = (content) => {
	// Display note content on page
	console.log("og", content);

	// Version number list
	var versionList = document.createElement("div");
	versionList.className = "release-menu";

	for (let i = 0; i < content.length; i++) {
		const contentArray = content[i];
		const subcontentArray = contentArray["content"];

		// Add versions to menu list
		versionMenuItem = document.createElement("div");
		versionList.appendChild(versionMenuItem).className = "version-menu-item";
		versionMenuItem.innerHTML = "Version" + " " + contentArray["version"];

		releaseNotes.elem.versionListContainer.appendChild(versionList);

		// Create release note post
		var NewReleaseNote = document.createElement("div");
		NewReleaseNote.className = "note";
		versionNumber = document.createElement("h2");
		NewReleaseNote.appendChild(versionNumber).className = "version-number";
		versionNumber.innerHTML = "Version" + " " + contentArray["version"];
		noteTitle = document.createElement("h3");
		NewReleaseNote.appendChild(noteTitle).className = "note-title";
		noteImg = document.createElement("img");
		NewReleaseNote.appendChild(noteImg).className = "note-img";
		noteText = document.createElement("p");
		NewReleaseNote.appendChild(noteText).className = "note-text";
		// List of bullet points
		notePointList = document.createElement("ul");
		notePoint = document.createElement("li");

		for (let i = 0; i < subcontentArray.length; i++) {
			const element = subcontentArray[i];
			if (element["type"] === "heading") {
				noteTitle.innerHTML = element["html"];
			} else if (element["type"] === "image") {
				noteImg.src = element["url"];
			} else if (element["type"] === "text") {
				noteText.innerHTML = element["html"];
			} else if (element["type"] === "point") {
				// TODO add forEach if point is array of points
				notePointList.appendChild(notePoint).className = "point";
				NewReleaseNote.appendChild(notePointList).className = "point-list";
				notePoint.innerHTML = element["html"];
			}
		}

		releaseNotes.elem.releaseNoteSection.appendChild(NewReleaseNote);
	}
};

// END ======================================================
