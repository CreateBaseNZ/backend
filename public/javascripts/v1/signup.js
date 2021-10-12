/* ========================================================================================
VARIABLES
======================================================================================== */

let signup = {
	initialise: undefined,
	collect: undefined,
	submit: undefined,
	validate: undefined,
	scorePassword: undefined,
	confirmPassword: undefined,
	enable: undefined,
	disable: undefined,
};

/* ========================================================================================
FUNCTIONS
======================================================================================== */

// @func  signup.initialise
// @desc
signup.initialise = async () => {
	// LOAD SYSTEM
	try {
		await global.initialise(false, false);
	} catch (error) {
		return console.log(error);
	}
	signup.confirmPassword();
	// REMOVE STARTUP LOADER
	removeLoader(false);
	// LOAD SESSION
	session.initialise();
};

// @func  signup.collect
// @desc
signup.collect = () => {
	const displayName = document.querySelector("#sign-up-dspl-name").value;
	const email = document.querySelector("#sign-up-eml").value;
	const password = document.querySelector("#sign-up-pwd").value;
	const confirmPassword = document.querySelector("#sign-up-cfrm-pwd").value;

	return [displayName, email, password, confirmPassword];
};

// @func  signup.submit
// @desc
signup.submit = async () => {
	signup.disable();
	// COLLECT
	const [displayName, email, password, confirmPassword] = signup.collect();
	// VALIDATION
	// Client
	if (!signup.validate(displayName, email, password, confirmPassword)) return signup.enable();
	// Server
	let data;
	try {
		data = (await axios.post("/signup/validate", { email }))["data"];
	} catch (error) {
		data = { status: "error", content: error };
	}
	if (data.status === "error") {
		// TODO .....
		// ERROR HANDLER
		// TODO .....
		console.log(data.content); // TEMPORARY
		return signup.enable();
	} else if (data.status === "failed") {
		document.querySelector("#signup-error-email").innerHTML = data.content;
		return signup.enable();
	}
	// SUCCESS HANDLER
	return document.querySelector("#sign-up-form").submit();
};

// @func  signup.validate
// @desc
signup.validate = (displayName, email, password, confirmPassword) => {
	// DECLARE VARIABLES
	let valid = true;
	let errorDisplayName = "";
	let errorEmail = "";
	let errorPassword = "";
	let errorConfirmPassword = "";
	let emailRE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let nameRE = /^[A-Za-z0-9_-\s]+$/;

	// VALIDATION
	// Display Name
	if (!displayName) {
		valid = false;
		errorDisplayName = "Display name required";
	} else if (!nameRE.test(String(displayName).toLowerCase())) {
		valid = false;
		errorDisplayName = "Only letters, numbers, spaces, dashes, and underscores allowed";
	}

	// Email
	if (!email) {
		valid = false;
		errorEmail = "Email required";
	} else if (!emailRE.test(String(email).toLowerCase())) {
		valid = false;
		errorEmail = "Invalid email";
	}
	// Password
	if (!password) {
		valid = false;
		errorPassword = "Password required";
	} else if (!signup.scorePassword(password)) {
		valid = false;
		errorPassword = "Password too weak";
	} else if (password.includes(" ") || password.includes("'") || password.includes('"')) {
		valid = false;
		errorPassword = "Password cannot contain quotation marks or spaces";
	}

	// Confirm Password
	if (!confirmPassword) {
		valid = false;
		errorConfirmPassword = "Please confirm your password";
	} else if (confirmPassword !== password) {
		valid = false;
		errorConfirmPassword = "Passwords do not match";
	}

	// SUCCESS HANDLER
	document.querySelector("#signup-error-display-name").innerHTML = errorDisplayName;
	document.querySelector("#signup-error-email").innerHTML = errorEmail;
	document.querySelector("#signup-error-password").innerHTML = errorPassword;
	document.querySelector("#signup-error-confirm-password").innerHTML = errorConfirmPassword;
	return valid;
};

// @func  signup.scorePassword
// @desc
signup.scorePassword = (pass) => {
	el = document.getElementById("pwd-strength");

	if (!pass) {
		el.innerHTML = "";
		el.style.color = "red";
		return false;
	}

	var score = 0;

	// Award every unique letter until 5 repetitions
	var letters = new Object();
	for (var i = 0; i < pass.length; i++) {
		letters[pass[i]] = (letters[pass[i]] || 0) + 1;
		score += 5.0 / letters[pass[i]];
	}

	// Bonus points for mixing it up
	var variations = {
		digits: /\d/.test(pass),
		lower: /[a-z]/.test(pass),
		upper: /[A-Z]/.test(pass),
		nonWords: /\W/.test(pass),
	};

	variationCount = 0;
	for (var check in variations) {
		variationCount += variations[check] == true ? 1 : 0;
	}
	score += (variationCount - 1) * 10;

	if (score > 80) {
		el.innerHTML = "Strong";
		el.style.color = "LimeGreen";
		return true;
	} else if (score > 60) {
		el.innerHTML = "Moderate";
		el.style.color = "Gold";
		return true;
	} else if (score > 40) {
		el.innerHTML = "Weak";
		el.style.color = "orange";
		return true;
	} else {
		el.innerHTML = "Very weak";
		el.style.color = "red";
		return false;
	}
};

// @func  signup.confirmPassword
// @desc
signup.confirmPassword = () => {
	// DECLARE ELEMENTS
	const inputPass = document.getElementById("sign-up-pwd");
	const confirm = document.getElementById("confirm-pass");
	const confirmInput = document.getElementById("sign-up-cfrm-pwd");

	// ADD LISTENER
	inputPass.addEventListener("input", (message) => {
		if (inputPass.value.length) {
			confirm.classList.add("dip-down");
		} else {
			confirm.classList.remove("dip-down");
			confirmInput.value = "";
		}
		signup.scorePassword(inputPass.value);
	});
};

// @func  signup.enable
// @desc
signup.enable = () => {
	// LOADER
	// TODO .....
	// TODO .....
	// BUTTONS
	document.querySelector("#signup-btn").removeAttribute("disabled");
};

// @func  signup.disable
// @desc
signup.disable = () => {
	// LOADER
	// TODO .....
	// TODO .....
	// BUTTONS
	document.querySelector("#signup-btn").setAttribute("disabled", "");
};

/* ========================================================================================
END
======================================================================================== */
