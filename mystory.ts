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


const displayPost = (post: Post) => {
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
    usernameP.addEventListener('click', async () => {
      allPosts.innerHTML="";
      const data = await fetchSearchUser(post.user);  
      if(!data){
        return;
      }
      data.forEach((post:Post) => {
        displayPost(post);
      });
    });
  }
};

/***************FETCH ALL USER POSTS*********************/
console.log(allPosts);

const getAllPosts = async () => {
const response = await fetch("http://localhost:3000/api/post/public");
const data = await response.json();
const sortedData =data.sort((a: { lastActiveAt: number; }, b: { lastActiveAt: number; }) => a.lastActiveAt - b.lastActiveAt);
console.log(data);
sortedData.reverse();
console.log(sortedData); //Somehow it doesnt sort my array by date.
sortedData.forEach((post:Post) => {
  displayPost(post);
});


};


getAllPosts();


/*************SEARCH BY NAME INPUT FIELD***********************/
/**we want to search for a "user" if found we want to to change div to 
  a div about the specific user**/

const inputSearcher = document.querySelector(".searchBar") as HTMLInputElement;
const submitSearch = document.querySelector('.searchBtn') as HTMLButtonElement;
const fetchSearchUser = async (name:string):Promise <Post[] |void> => {
  try {
    const response = await fetch("http://localhost:3000/api/post/search", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user:name
      })
    });
    const data = await response.json();
    console.group(data);
    if(!data){
      return;
    }
    return data;
  } catch (error:any) {
    console.log(error);
  }
}


submitSearch.addEventListener("click", async () => {
  allPosts.innerHTML="";
  const data = await fetchSearchUser(inputSearcher.value);  
  if(!data){
    return;
  }
  data.forEach((post:Post) => {
    displayPost(post);
  });
});





