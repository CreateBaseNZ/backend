const marketInit = () => {

    const left = document.querySelector('.market-left')
    const right = document.querySelector('.market-right')
    const show = document.querySelector('.market-btn')
    const text = document.querySelector('.mid-text')
    const btn = document.querySelector('.market-btn')

    show.addEventListener('click', function() {  
        left.classList.toggle('market-left-active')
        right.classList.toggle('market-right-active')
        text.classList.toggle('mid-text-active')
        if (btn.innerHTML == "SHOW MORE") {
            btn.innerHTML = "SHOW LESS"
        } else {
            btn.innerHTML = "SHOW MORE"
        }
    })

}
