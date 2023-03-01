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
        localStorage.setItem("user", data);
    }
    catch (error) {
        console.error(error);
    }
});
loginBtn === null || loginBtn === void 0 ? void 0 : loginBtn.addEventListener("click", logIn);
