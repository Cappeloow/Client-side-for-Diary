const registerUsername = document.querySelector("#registerUsername")as HTMLInputElement
const registerPassword = document.querySelector("#registerPassword") as HTMLInputElement
const registerSubmit = document.querySelector("#registerSubmit") as HTMLButtonElement

const container = document.querySelector(".container") as HTMLDivElement;
const Register = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username:registerUsername.value,
          password:registerPassword.value
        })
      });
      const data = await response.json();
      checkData(data);
      

    } catch (error:any) {
   
    }
  }
  
  registerSubmit.addEventListener("click",Register);

  function checkData (data:any) {
    if (data.username){
        console.log(data);
        const paragraphSuccess = document.createElement("p") as HTMLParagraphElement;
        paragraphSuccess.innerText = "Account has been created";
        paragraphSuccess.id="paragraphSuccess";
        container.append(paragraphSuccess);
        setTimeout(() => {
            paragraphSuccess.remove();
        }, 1950)
        setTimeout(() => {
            window.location.href ="index.html";
        }, 2000)
      } else {
        console.log(data);
        const paragraphError = document.createElement("p") as HTMLParagraphElement;
        paragraphError.innerText = data;
        paragraphError.id="errorMessage";
        container.append(paragraphError);
        setTimeout(() => {
          paragraphError.remove();
      }, 2000)
      }
  }