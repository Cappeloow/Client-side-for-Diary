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
const refreshIcon = document.querySelector("#refreshIcon");
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
    console.log('createPostsToDatabase called');
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
        yield getAllPosts();
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
    const postId = `post-${Math.random().toString(36).substring(7)}`;
    const postTemplate = `
    <div class="post" id="${postId}">
      <h3>${post.title}</h3>
      <p class="usernameP">@${post.user}</p>
      <p class="contentP">${post.content}</p>
    </div>
  `;
    allPosts.insertAdjacentHTML('beforeend', postTemplate);
    const usernameP = document.querySelector(`#${postId} .usernameP`);
    if (usernameP) {
        usernameP.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            allPosts.innerHTML = "";
            const data = yield fetchSearchUser(post.user);
            if (!data) {
                return;
            }
            data.forEach((post) => {
                displayPost(post);
            });
        }));
    }
};
/***************FETCH ALL USER POSTS*********************/
console.log(allPosts);
const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    allPosts.innerHTML = "";
    console.log('getAllPosts called');
    try {
        const response = yield fetch("http://localhost:3000/api/post/public");
        const data = yield response.json();
        const sortedData = yield sortArrayByDate(data);
        sortedData.forEach((post) => {
            displayPost(post);
        });
    }
    catch (error) {
        console.log(error);
    }
});
getAllPosts();
const sortArrayByDate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const sortedData = data.sort((a, b) => a.lastActiveAt - b.lastActiveAt);
    console.log(data);
    sortedData.reverse();
    return sortedData;
});
refreshIcon.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    yield getAllPosts();
}));
/*************SEARCH BY NAME INPUT FIELD***********************/
/**we want to search for a "user" if found we want to to change div to
  a div about the specific user**/
const inputSearcher = document.querySelector(".searchBar");
const submitSearch = document.querySelector('.searchBtn');
const fetchSearchUser = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("http://localhost:3000/api/post/search", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: name
            })
        });
        const data = yield response.json();
        console.group(data);
        if (!data) {
            return;
        }
        return data;
    }
    catch (error) {
        console.log(error);
    }
});
submitSearch.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    allPosts.innerHTML = "";
    const data = yield fetchSearchUser(inputSearcher.value);
    if (!data) {
        return;
    }
    data.forEach((post) => {
        displayPost(post);
    });
}));
//fetch the delete post,
// we need to check if it's the users posts, if it is the users post create a icon X
// if clicked on the x, we need to give the users name + the posts that we want to remove.
//
