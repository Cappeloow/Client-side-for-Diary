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
const sideBar = document.querySelector(".sidebar");
const startingPhrase = () => {
    let user = localStorage.getItem("user");
    if (user !== null) {
        let parsedUser = JSON.parse(user);
        const paragraphWelcomeUser = document.createElement("p");
        parsedUser.name = parsedUser.username.split('@')[0];
        paragraphWelcomeUser.innerText = `logged in as: ${parsedUser.name}`;
        sideBar.appendChild(paragraphWelcomeUser);
        return parsedUser;
    }
    else {
        window.location.href = "index.html";
        return undefined;
    }
};
const LoggedUser = startingPhrase();
console.log(LoggedUser);
const contentInput = document.querySelector(".contentInput");
const titleInput = document.querySelector(".titleInput");
const submitPost = document.querySelector(".submitPost");
const createPostsToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!LoggedUser) {
        throw new Error('User is not logged in');
    }
    try {
        const response = yield fetch("http://localhost:3000/api/post/send", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: LoggedUser.name,
                title: titleInput.value,
                content: contentInput.value
            })
        });
        const data = yield response.json();
        titleInput.value = "";
        contentInput.value = "";
        console.log(data);
        getAllPosts();
        if (!response.ok) {
            throw new Error('Request failed');
        }
    }
    catch (error) {
        console.log(error);
    }
});
submitPost.addEventListener("click", createPostsToDatabase);
const allPosts = document.querySelector(".allPosts");
const displayPost = (post) => {
    const postTemplate = `
  <div class="post">
    <h2>${post.user}</h2>
    <h3>${post.title}</h3>
    <p>${post.content}</p>
  </div>
  `;
    allPosts.insertAdjacentHTML('beforeend', postTemplate);
};
/***************FETCH ALL USER POSTS*********************/
console.log(allPosts);
const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("http://localhost:3000/api/post/public");
    const data = yield response.json();
    const sortedData = data.sort((a, b) => a.lastActiveAt - b.lastActiveAt);
    console.log(data);
    console.log(sortedData); //Somehow it doesnt sort my array by date.
    sortedData.forEach((post) => {
        displayPost(post);
    });
});
getAllPosts();
