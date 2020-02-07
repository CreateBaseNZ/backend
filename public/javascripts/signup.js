/*=========================================================================================
VARIABLES
=========================================================================================*/

/*=========================================================================================
FUNCTIONS
=========================================================================================*/

const loginInit = () => {
    textSequence(0);
}

const toggleContainer = () => {
    container.classList.toggle("right-panel-active");
}

function textSequence(i) {
    // Cycle through words
    let words = ['Creator', 'Maverick', 'Trailblazer', 'Innovator'];

    if (words.length > i) {
        if (i == 1) {
            setTimeout(function() {
                document.getElementById("change-text").innerHTML = words[i];
                document.getElementById("change-text").setAttribute("data-text", words[i]);
                textSequence(++i);
            },3000); // 1 second (in milliseconds)
        } else {
        setTimeout(function() {
            document.getElementById("change-text").innerHTML = words[i];
            document.getElementById("change-text").setAttribute("data-text", words[i]);
            textSequence(++i);
        }, 1000); // 1 second (in milliseconds)
        }
    } else if (words.length == i) { // Loop
        textSequence(0);
    }
}

/*=========================================================================================
END
=========================================================================================*/