const sideBar = document.querySelector(".sidebar") as HTMLDivElement;
const refreshIcon = document.querySelector("#refreshIcon") as HTMLHeadElement;
// import { User, Post  } from "./interfacesntypes";
const createANewPostText = document.querySelector('#createANewPost') as HTMLHeadElement;
const divForCreatePost = document.querySelector(".circleAroundInputs") as HTMLDivElement;
const inputTitle = document.querySelector('.titleInput') as HTMLInputElement;
const inputContent = document.querySelector('.contentInput') as HTMLTextAreaElement;

/***********SMOOTHER EFFECT WHEN CLICKED*******/
createANewPostText.addEventListener("click", () => {
  createANewPostText.style.display ="none";
  let interval1 = setInterval(function() {
    divForCreatePost.style.display="flex";
    divForCreatePost.style.opacity="0.2";
  }, 50);
  let interval2 = setInterval(function() {
    divForCreatePost.style.opacity="1";
    inputTitle.style.opacity="1";
  }, 300);
  setTimeout(function() {
    clearInterval(interval1);
    clearInterval(interval2);
  }, 300);
})
 type User ={
  backgroundColor: string;
  _id:string,
  username:string,
  isAdmin:string,
  name:string
}


 type Post = {
  _id: any;
  likes: number | string;
  backgroundColor: string;
  content:string,
  user:string,
  title:string,
}
const randomColor = ():string => {
  const hexChars = '0123456789abcdef';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexChars[Math.floor(Math.random() * hexChars.length)];
  }

  return color;
}
const startingPhrase = ():User |undefined=> {
  let user = localStorage.getItem("user");
    if (user !== null) {
      let parsedUser = JSON.parse(user);
      const paragraphWelcomeUser = document.createElement("p") as HTMLParagraphElement;
      parsedUser.name = parsedUser.username.split('@')[0];
      paragraphWelcomeUser.innerText = `logged in as: ${parsedUser.name} `;
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
  console.log('createPostsToDatabase called');
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
    await getAllPosts();
    createANewPostText.style.display ="block";
    divForCreatePost.style.display="none";
    if (!response.ok) {
      throw new Error('Request failed');
    }
  } catch (error) {
    console.log(error);
  }
}
submitPost.addEventListener("click",createPostsToDatabase);


const allPosts = document.querySelector(".allPosts") as HTMLDivElement;



const displayPost = (post: Post) => {
  const postId = `post-${Math.random().toString(36).substring(7)}`;

  //egentligen kan vi byta postId till den som mongoose ger oss för varje post.
  const postTemplate = `
    <div class="PostDiv" id="${postId}"> 
      <div id="wrapper">
        <div class="profilePicture"><span class="material-symbols-outlined">face</span>
        </div>
        <p class="usernameP">@${post.user}
        </p>
        ${post.user === LoggedUser!.name ? '<p class="deleteP">X</p>' : ''}
      </div>
      <h3>${post.title}</h3>
      <p class="contentP">${post.content}</p>
      <p class="likesP">${post.likes}</p>
      <button class="thumbsup">Up</button>
    </div>
  `;


  allPosts.insertAdjacentHTML('beforeend', postTemplate);
  const LikeButton = document.querySelector(`#${postId} .thumbsup `) as HTMLButtonElement;
if(LikeButton){
  LikeButton.addEventListener("click", async () => {
    console.log("click", post);
    await LikeThePost(post);
  })
}

  
  const profilePicture = document.querySelector(`#${postId} .profilePicture`) as HTMLDivElement;
  profilePicture.style.backgroundColor = post.backgroundColor;

  const deleteP = document.querySelector(`#${postId} .deleteP`) as HTMLParagraphElement;
  const yes = document.createElement("p") as HTMLParagraphElement;
  const no = document.createElement("p") as HTMLParagraphElement;
  const yesOrNo = document.createElement("div") as HTMLDivElement;
  if (deleteP) {
    deleteP.addEventListener('click', async () => {
      yesOrNo.id = "yesOrNo";
      yesOrNo.innerText = "Are you sure you want to remove this post?";

      yes.innerText = "yes";
      no.innerText = "no";
      yesOrNo.append(yes, no);
      deleteP.append(yesOrNo);
      yes.addEventListener("click", async () => {
        await fetchDeletePost(post);
      });
      no.addEventListener("click", () => {
        yesOrNo.remove();
      });
    });
  }
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
  allPosts.innerHTML="";
  console.log('getAllPosts called');
  try {
    const response = await fetch("http://localhost:3000/api/post/public");
    const data = await response.json();
    const sortedData = await sortArrayByDate(data);
    sortedData.forEach((post:Post) => {
      displayPost(post);
    });
  } catch (error) {
    console.log(error);
  }
};
getAllPosts();

const sortArrayByDate = async (data: any[]): Promise<Post[]> => {
  const sortedData = data.sort((a: { lastActiveAt: number }, b: { lastActiveAt: number }) => a.lastActiveAt - b.lastActiveAt);
  const modifiedData = sortedData.map(post => {
    return {...post, backgroundColor: randomColor()};
  });
  console.log(modifiedData);
  modifiedData.reverse();
  return modifiedData;
};

refreshIcon.addEventListener("click", async () => {

await getAllPosts();
});
/*************SEARCH BY NAME INPUT FIELD***********************/
/**we want to search for a "user" if found we want to to change div to 
  a div about the specific user**/

const inputSearcher = document.querySelector(".searchBar") as HTMLInputElement;
const submitSearch = document.querySelector('.searchBtn') as HTMLButtonElement;

/***Cool effect on my Submit search Btn***/

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




//fetch the delete post,
// we need to check if it's the users posts, if it is the users post create a icon X
// if clicked on the x, we need to give the users name + the posts that we want to remove.
//

const fetchDeletePost = async (post:Post) => {
  // we need to get the all the usersposts in an array
  // const usersPosts = await fetchSearchUser(LoggedUser!.name);
  // console.group(usersPosts);
  try {
    const response = await fetch("http://localhost:3000/api/post/delete", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user:LoggedUser!.name,
        _id:post
      })
    });
    const data = await response.json();
    console.group(data);
    if(!data){
      return;
    }
    await getAllPosts();
    return data;
  } catch (error:any) {
    console.log(error);
  }
}

/************LIKING FETCH************/

const LikeThePost = async (post:Post) => {
  try {
    const response = await fetch("http://localhost:3000/api/post/like", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user:LoggedUser!.name,
        _id:post._id
      })
    });
    const data = await response.json();
    if(!data){
      return;
    }
    await getAllPosts();
    return data;
  } catch (error:any) {
    console.log(error);
  }
}
