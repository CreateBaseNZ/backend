const marketInit = () => {

    const left = document.querySelector('.market-left')
    const right = document.querySelector('.market-right')
    const show = document.querySelector('.market-btn')
    const text = document.querySelector('.mid-text')

    show.addEventListener('click', function() {  
        left.classList.toggle('market-left-active')
        right.classList.toggle('market-right-active')
        text.classList.toggle('mid-text-active')
        if (text.childNodes[3].innerHTML == "SHOW MORE") {
            console.log(text.childNodes[3])
            text.childNodes[3].innerHTML = "SHOW LESS"
        } else {
            console.log(text.childNodes)
            text.childNodes[3].innerHTML = "SHOW MORE"
        }
    })

}
