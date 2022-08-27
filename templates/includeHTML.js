async function init() {
    await includeHTML();
    legacyTurn()
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function legacyTurn() {
    if (window.location.href == 'https://gruppe-289.developerakademie.net/datenschutz.html' || window.location.href == 'https://gruppe-289.developerakademie.net/impressum.html') {
        document.getElementById("responsive").classList.add('d-none');
        document.getElementById("links").classList.add('d-none');
        document.getElementById("legacy-btn").classList.add('d-none');
    } else {
        document.getElementById("responsive").classList.remove('d-none');
        document.getElementById("links").classList.remove('d-none');
        document.getElementById("legacy-btn").classList.remove('d-none');
    }
}