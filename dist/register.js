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
const registerUsername = document.querySelector("#registerUsername");
const registerPassword = document.querySelector("#registerPassword");
const registerSubmit = document.querySelector("#registerSubmit");
const container = document.querySelector(".container");
const Register = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:3000/api/users/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: registerUsername.value,
                password: registerPassword.value
            })
        });
        const data = yield response.json();
        checkData(data);
    }
    catch (error) {
    }
});
registerSubmit.addEventListener("click", Register);
function checkData(data) {
    if (data.username) {
        console.log(data);
        const paragraphSuccess = document.createElement("p");
        paragraphSuccess.innerText = "Account has been created";
        paragraphSuccess.id = "paragraphSuccess";
        container.append(paragraphSuccess);
        setTimeout(() => {
            paragraphSuccess.remove();
        }, 1950);
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
    else {
        console.log(data);
        const paragraphError = document.createElement("p");
        paragraphError.innerText = data;
        paragraphError.id = "errorMessage";
        container.append(paragraphError);
        setTimeout(() => {
            paragraphError.remove();
        }, 2000);
    }
}
