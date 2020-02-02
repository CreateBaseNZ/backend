// Slider animation
const login = document.getElementById('hello-login');
const back = document.getElementById('back-btn');
const container = document.getElementById('container');

login.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

back.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Cycle through words
var words = ['Creator', 'Maverick', 'Trailblazer', 'Innovator'];

textSequence(0);
function textSequence(i) {

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




