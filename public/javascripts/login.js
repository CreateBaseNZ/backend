const loginInit = () => {
    textSequence(0, ['Creator', 'Maverick', 'Trailblazer', 'Innovator'])
}

const toggleContainer = () => {
    container.classList.toggle("right-panel-active")
}

function textSequence(i, words) {
    // Cycle through words
    // let words = ['Creator', 'Maverick', 'Trailblazer', 'Innovator']
    document.getElementById("change-text").innerHTML = words[i]
    document.getElementById("change-text").setAttribute('data-text', words[i])
    setTimeout(function() {
        document.getElementById("change-text").classList.remove("glitch")
        setTimeout(function() {
            document.getElementById("change-text").classList.add("glitch")
            setTimeout(function() {
                i = (Math.floor(Math.random()*words.length))
                textSequence(i, words)
            }, (100 + Math.random()*100))
        }, (500 + Math.random()*1500))
    }, (50 + Math.random()*50))
}