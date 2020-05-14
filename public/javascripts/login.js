const loginInit = () => {
    textSequence(0, ['Creator', 'Maverick', 'Trailblazer', 'Innovator'])
}

const engKitsInit = () => {
    textSequence(0, ['COMING SOON', 'ENG KITS'])
}

const toggleContainer = () => {
    container.classList.toggle("right-panel-active")
}

function textSequence(i, words) {
    // Cycle through words
    // let words = ['Creator', 'Maverick', 'Trailblazer', 'Innovator']
    console.log(words)
    document.getElementById("change-text").innerHTML = words[i]
    setTimeout(function() {
        document.getElementById("change-text").classList.remove("glitch")
        setTimeout(function() {
            document.getElementById("change-text").classList.add("glitch")
            setTimeout(function() {
                i = (Math.floor(Math.random()*words.length))
                textSequence(i,words)
            }, (100 + Math.random()*100))
        }, (500 + Math.random()*1500))
    }, (50 + Math.random()*50))
}