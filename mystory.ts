const sideBar = document.querySelector(".sidebar") as HTMLDivElement;

const startingPhrase = () => {
    let user = localStorage.getItem("user");
    if (user !== null) {
      let parsedUser = JSON.parse(user);
      const paragraphWelcomeUser = document.createElement("p") as HTMLParagraphElement;
      parsedUser.name = parsedUser.username.split('@')[0];
      paragraphWelcomeUser.innerText = `${parsedUser.name}`;
      console.log(parsedUser);
      sideBar.appendChild(paragraphWelcomeUser);
    } else {
      window.location.href = "index.html";
    }
}
startingPhrase();



