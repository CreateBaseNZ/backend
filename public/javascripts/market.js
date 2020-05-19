const marketInit = () => {
    textSequence(0, ['COMING SOON', 'MARKETPLACE'])
}

function textSequence(i, words) {
    // Cycle through words
    document.getElementById("change-text").innerHTML = words[i]
    document.getElementById("change-text").setAttribute('data-text', words[i])
    setTimeout(function() {
        document.getElementById("change-text").classList.remove("glitch")
        setTimeout(function() {
            document.getElementById("change-text").classList.add("glitch")
            setTimeout(function() {
                i += 1
                if (i >= words.length){
                    i = 0
                }
                textSequence(i,words)
            }, (100 + Math.random()*100))
        }, (500 + Math.random()*1500))
    }, (50 + Math.random()*50))
}
