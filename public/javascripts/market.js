const marketInit = async() => {

    let status;
    try {
    status = (await axios.get("/login-status"))["data"]["status"]
    } catch (error) {
    console.log(error)
    return
    }

    const left = document.querySelector('.market-left')
    const right = document.querySelector('.market-right')
    const text = document.querySelector('.market-mid')
    const show = document.querySelector('.market-show')

    if (status) {
        show.addEventListener('click', function() {  
            document.querySelector('.market-already-updated').style.display = 'inline-block'
            left.classList.toggle('market-left-active')
            right.classList.toggle('market-right-active')
            text.classList.toggle('market-mid-active-in')
            if (show.innerHTML == "SHOW MORE") {
                show.innerHTML = "SHOW LESS"
            } else {
                show.innerHTML = "SHOW MORE"
            }
        })
    } else {
        document.querySelector('.market-fld').style.display = 'inline-block'
        document.querySelector('.market-get-updates').style.display = 'inline-block'
        document.querySelector('.market-btn').style.display = 'inline-block'
        show.addEventListener('click', function() {  
            left.classList.toggle('market-left-active')
            right.classList.toggle('market-right-active')
            text.classList.toggle('market-mid-active-out')
            if (show.innerHTML == "SHOW MORE") {
                show.innerHTML = "SHOW LESS"
            } else {
                show.innerHTML = "SHOW MORE"
            }
        })
    }

}
