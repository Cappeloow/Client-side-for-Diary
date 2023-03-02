"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const inputUsername = document.querySelector(".username");
const inputPassword = document.querySelector(".password");
const loginBtn = document.querySelector("#loginBtn");
const goToRegister = document.querySelector("#goToRegister");
const loginVisuals = document.querySelector("#loginVisuals");
function typeOutParagraph(text, element) {
    let index = 0;
    function typeNextLetter() {
        element.textContent += text[index];
        index++;
        if (index < text.length) {
            setTimeout(typeNextLetter, 100); // Delay between each letter in milliseconds
        }
    }
    typeNextLetter();
}
const paragraph = document.createElement('p');
loginVisuals.append(paragraph);
(function startingAnimationFrontPage() {
    typeOutParagraph("my day was perfect..", paragraph);
    var sun = document.createElement("div");
    sun.id = "sun";
    sun.style.width = "160px";
    sun.style.height = "160px";
    sun.style.borderRadius = "50%";
    sun.style.backgroundColor = "yellow";
    sun.style.boxShadow = "0 0 50px 10px yellow";
    sun.style.position = "absolute";
    sun.style.bottom = "-100px"; // start off-screen at the bottom
    sun.style.left = "250px";
    loginVisuals.appendChild(sun);
    // Move the sun up
    var currentPosition = -100;
    var moveInterval = setInterval(function () {
        currentPosition++;
        sun.style.bottom = currentPosition + "px";
        if (currentPosition >= 500) {
            clearInterval(moveInterval);
        }
    }, 10);
})();
const logIn = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:3000/api/users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: inputUsername.value,
                password: inputPassword.value
            })
        });
        const data = yield response.json();
        console.log(data.username);
        if (data.username) {
            window.location.href = "mystory.html";
        }
        localStorage.setItem("user", JSON.stringify(data));
    }
    catch (error) {
        console.error(error);
    }
});
goToRegister.addEventListener("click", () => {
    window.location.href = "register.html";
});
loginBtn.addEventListener("click", logIn);
/*************REGISTER FETCH N LOGIC*******************/
