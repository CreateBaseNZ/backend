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
		let notePointList;
		for (let i = 0; i < subcontentArray.length; i++) {
			const element = subcontentArray[i];
			if (i > 0) {
				if (subcontentArray[i]["type"] === "point" && subcontentArray[i - 1]["type"] !== "point") {
					// List of bullet points
					notePointList = document.createElement("ul");
					NewReleaseNote.appendChild(notePointList).className = "point-list";
				}
			}
			if (element["type"] === "heading") {
				const noteTitle = document.createElement("h3");
				NewReleaseNote.appendChild(noteTitle).className = "note-title";
				noteTitle.innerHTML = element["html"];
			} else if (element["type"] === "image") {
				const noteImg = document.createElement("img");
				NewReleaseNote.appendChild(noteImg).className = "note-img";
				noteImg.src = element["url"];
			} else if (element["type"] === "text") {
				const noteText = document.createElement("p");
				noteText.innerHTML = element["html"];
				NewReleaseNote.appendChild(noteText).className = "note-text";
			} else if (element["type"] === "point") {
				const notePoint = document.createElement("li");
				notePointList.appendChild(notePoint).className = "point";
				// TODO add forEach if point is array of points
				notePoint.innerHTML = element["html"];
			}
		}

		releaseNotes.elem.releaseNoteSection.appendChild(NewReleaseNote);
	}
};

// END ======================================================
