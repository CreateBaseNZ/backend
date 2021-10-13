let footer = {
	init: {
		attachListeners: undefined,
		init: undefined,
	},

	elem: {
		subscribeBtn: document.querySelector(".footer-btn"),
		subscribeError: document.querySelector(".footer-error"),
		subscribeInput: document.querySelector("#footer-input"),
	},

	event: {
		subscribeEnter: undefined,
		subscribeInput: undefined,
	},

	subscribeSubmit: undefined,
};

// ==================================================================
// FUNCTIONS
// ==================================================================

footer.init.init = () => {
	footer.init.attachListeners();
};

footer.init.attachListeners = () => {
	footer.elem.subscribeInput.addEventListener("input", footer.event.subscribeInput);
	footer.elem.subscribeInput.addEventListener("keypress", footer.event.subscribeEnter);
	footer.elem.subscribeBtn.addEventListener("click", footer.subscribeSubmit);
};

footer.event.subscribeInput = function () {
	footer.elem.subscribeError.innerHTML = "";
	if (this.value) {
		footer.elem.subscribeBtn.classList.add("active");
	} else {
		footer.elem.subscribeBtn.classList.remove("active");
	}
};

footer.event.subscribeEnter = (e) => {
	if (e.key === "Enter") {
		footer.subscribeSubmit();
	}
};

footer.subscribeSubmit = async () => {
	// Disable
	footer.elem.subscribeBtn.classList.remove("active");
	footer.elem.subscribeInput.style.animationName = "";
	void footer.elem.subscribeInput.offsetWidth;

	// VALIDATE
	const result = global.validateEmail(footer.elem.subscribeInput.value);
	if (result === "empty") {
		footer.elem.subscribeError.innerHTML = "An email is required";
		footer.elem.subscribeInput.style.animationName = "footer-shake";
		return;
	} else if (result === "invalid") {
		footer.elem.subscribeError.innerHTML = "Please enter a valid email";
		footer.elem.subscribeBtn.classList.add("active");
		footer.elem.subscribeInput.style.animationName = "footer-shake";
		return;
	}

	// SUBMIT
	let data;
	try {
		data = await global.subscribe(footer.elem.subscribeInput.value);
	} catch (error) {
		// Rejected
		if (error === "error") {
			notification.generate("subscribe", "error");
		} else if (error === "failed") {
			notification.generate("subscribe", "error");
		}
		return;
	}
	// Resolved
	if (data === "already subscribed") {
		// Already subscribed
		notification.generate("subscribe", "already");
		footer.elem.subscribeBtn.classList.add("active");
	} else {
		// Success
		notification.generate("subscribe", "success");
		footer.elem.subscribeInput.value = "";
		footer.elem.subscribeError.innerHTML = "";
	}
};
