const sideBar = document.querySelector(".sidebar") as HTMLDivElement;

const startingPhrase = () => {
    let user = localStorage.getItem("user");
    if (user !== null) {
      let parsedUser = JSON.parse(user);
      console.log(parsedUser);
      const paragraphWelcomeUser = document.createElement("p") as HTMLParagraphElement;
      paragraphWelcomeUser.innerText = `Welcome ${parsedUser.username}`;
      sideBar.appendChild(paragraphWelcomeUser);
    } else {
      window.location.href = "index.html";
    }
}
startingPhrase();



