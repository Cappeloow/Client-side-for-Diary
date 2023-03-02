"use strict";
const sideBar = document.querySelector(".sidebar");
const startingPhrase = () => {
    let user = localStorage.getItem("user");
    if (user !== null) {
        let parsedUser = JSON.parse(user);
        console.log(parsedUser);
        const paragraphWelcomeUser = document.createElement("p");
        paragraphWelcomeUser.innerText = `Welcome ${parsedUser.username}`;
        sideBar.appendChild(paragraphWelcomeUser);
    }
    else {
        window.location.href = "index.html";
    }
};
startingPhrase();
