const sideBar = document.querySelector(".sidebar") as HTMLDivElement;

type User ={
  _id:string,
  username:string,
  isAdmin:string,
  name:string
}

const startingPhrase = ():User |undefined=> {
  let user = localStorage.getItem("user");
    if (user !== null) {
      let parsedUser = JSON.parse(user);
      const paragraphWelcomeUser = document.createElement("p") as HTMLParagraphElement;
      parsedUser.name = parsedUser.username.split('@')[0];
      paragraphWelcomeUser.innerText = `logged in as: ${parsedUser.name}`;
      sideBar.appendChild(paragraphWelcomeUser);
      return parsedUser;
    } else {
      window.location.href = "index.html";
      return undefined;
    }
}
const LoggedUser:User | undefined= startingPhrase();
console.log(LoggedUser);

const contentInput = document.querySelector(".contentInput") as HTMLInputElement;
const titleInput = document.querySelector(".titleInput") as HTMLTextAreaElement;
const submitPost = document.querySelector(".submitPost") as HTMLButtonElement;


const createPostsToDatabase = async () => {
  if (!LoggedUser) {
    throw new Error('User is not logged in');
  }
  try {
    const response = await fetch("http://localhost:3000/api/post/send", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user:LoggedUser.name,
        title: titleInput.value,
        content: contentInput.value
      })    
    });
  
    const data = await response.json();
    titleInput.value="";
    contentInput.value="";
    console.log(data);
    getAllPosts();
    if (!response.ok) {
      throw new Error('Request failed');
    }
  } catch (error) {
    console.log(error);
  }
 
}


submitPost.addEventListener("click",createPostsToDatabase);

type Post = {
  content:string,
  user:string,
  title:string
}
const allPosts = document.querySelector(".allPosts") as HTMLDivElement;


const displayPost = (post:Post) => {
  const postTemplate = `
  <div class="post">
    <h2>${post.user}</h2>
    <h3>${post.title}</h3>
    <p>${post.content}</p>
  </div>
  `
  allPosts.insertAdjacentHTML('beforeend',postTemplate);
}

/***************FETCH ALL USER POSTS*********************/
console.log(allPosts);

const getAllPosts = async () => {
const response = await fetch("http://localhost:3000/api/post/public");
const data = await response.json();
const sortedData =data.sort((a: { lastActiveAt: number; }, b: { lastActiveAt: number; }) => a.lastActiveAt - b.lastActiveAt);
console.log(data);
console.log(sortedData); //Somehow it doesnt sort my array by date.
sortedData.forEach((post:Post) => {
  displayPost(post);
});


};


getAllPosts();