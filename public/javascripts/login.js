/*=================================================================================
VARIABLES
=================================================================================*/

/*=================================================================================
FUNCTIONS
=================================================================================*/

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
        if (i == 0) {
            document.getElementById("change-text").innerHTML = words[i];
            document.getElementById("change-text").setAttribute("data-text", words[i]);
            setTimeout(function() {
                document.getElementById("change-text").classList.remove("glitch");
                setTimeout(function() {
                    document.getElementById("change-text").classList.add("glitch");
                    setTimeout(function() {
                        textSequence(++i);
                    }, 140);
                }, 2500);
            }, 40);
        } else {
            document.getElementById("change-text").innerHTML = words[i];
            document.getElementById("change-text").setAttribute("data-text", words[i]);
            setTimeout(function() {
                document.getElementById("change-text").classList.remove("glitch");
                setTimeout(function() {
                    document.getElementById("change-text").classList.add("glitch");
                    setTimeout(function() {
                        textSequence(++i);
                    }, 150);
                }, 300);
            }, 60);            
        }
       
    } else if (words.length == i) { // Loop
        textSequence(0);
    }
}

/*=================================================================================
END
=================================================================================*/