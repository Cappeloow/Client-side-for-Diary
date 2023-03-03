
const inputUsername = document.querySelector(".username") as HTMLInputElement;
const inputPassword = document.querySelector(".password") as HTMLInputElement;
const loginBtn = document.querySelector("#loginBtn") as HTMLButtonElement;
const goToRegister = document.querySelector("#goToRegister") as HTMLButtonElement;
const loginVisuals = document.querySelector("#loginVisuals") as HTMLDivElement;
function typeOutParagraph(text: string, element: HTMLElement) {
  let index = 0;

  function typeNextLetter() {
    element.textContent += text[index];
    index++;

    if (index < text.length) {
      setTimeout(typeNextLetter,  100); // Delay between each letter in milliseconds
    } 

  }

  typeNextLetter();
}

const paragraph = document.createElement('p');
loginVisuals.append(paragraph);

(function startingAnimationFrontPage () {
  typeOutParagraph("my day was perfect..", paragraph);

var sun = document.createElement("div");
sun.id ="sun"





loginVisuals.appendChild(sun);

var currentPosition = -100;
var moveInterval = setInterval(function() {
  currentPosition++;
  sun.style.bottom = currentPosition + "px";
  if (currentPosition >= 500) {
    clearInterval(moveInterval);
  }
}, 10);



})();

const logIn = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username:inputUsername.value,
            password:inputPassword.value
          })
        });
        const data = await response.json();
        console.log(data.username);
        if (data.username){
          window.location.href ="mystory.html";
        }
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }

}
goToRegister.addEventListener("click",() => {
  window.location.href ="register.html";
})

loginBtn.addEventListener("click", logIn);




/*************REGISTER FETCH N LOGIC*******************/
