const marketInit = () => {

    const left = document.querySelector('.market-left')
    const right = document.querySelector('.market-right')
    const show = document.querySelector('.market-btn')
    const text = document.querySelector('.mid-text')

    show.addEventListener('click', function() {  
        left.classList.toggle('market-left-active')
        right.classList.toggle('market-right-active')
        text.classList.toggle('mid-text-active')
        if (text.children[1].innerHTML == "SHOW MORE") {
            text.children[1].innerHTML = "SHOW LESS"
        } else {
            text.children[1].innerHTML = "SHOW MORE"
        }
    })

}
