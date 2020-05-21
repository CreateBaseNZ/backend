const marketInit = () => {
    textSequence(0, ['COMING SOON', 'MARKETPLACE'])
}

function textSequence(i, words) {
    // Cycle through words
    document.getElementById("change-text").innerHTML = words[i]
    document.getElementById("change-text").setAttribute('data-text', words[i])
    setTimeout(function () {
        document.getElementById("change-text").classList.remove("glitch")
        setTimeout(function () {
            document.getElementById("change-text").classList.add("glitch")
            setTimeout(function () {
                i += 1
                if (i >= words.length) {
                    i = 0
                }
                textSequence(i, words)
            }, (100 + Math.random() * 100))
        }, (500 + Math.random() * 1500))
    }, (50 + Math.random() * 50))

}

function subscribeNotif() {
    //Create div to insert
    let newDiv = document.createElement('div')
    newDiv.className = 'subbed-notif'
    let messageWrap = document.createElement('div')
    newDiv.appendChild(messageWrap).className = 'subMsgWrap'
    messageWrap.appendChild(document.createElement('i')).className = 'fab fa-telegram-plane'
    messageWrap.appendChild(document.createElement('p')).innerHTML = 'Thank you for subscribing to the newsletter!'

    //Find location to insert div
    let notifDiv = document.getElementById('notification-wrap')
    let cookieDiv = document.getElementById('cookie-container')

    //Insert div
    notifDiv.insertBefore(newDiv, cookieDiv.nextSibling)
}

subscribe.listener = async () => {
    // Declare and initialise variables
    let input = document.getElementById('sign-up-eml');
    let subBtn = document.getElementById('subscribe-main');
    // Subscribe user
    try {
        await subscribe(input.value);
    } catch (error) {
        return console.log(error);
    }
    input.value = ''; // Clear email input field
    // Success Handler
    subBtn.innerHTML = 'SUBSCRIBE NEW EMAIL';
    subscribeNotif();
    return;
}

