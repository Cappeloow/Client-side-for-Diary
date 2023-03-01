
const inputUsername = document.querySelector(".username") as HTMLInputElement;
const inputPassword = document.querySelector(".password") as HTMLInputElement;
const loginBtn = document.querySelector("#loginBtn");

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
        localStorage.setItem("user", data)
      } catch (error) {
        console.error(error);
      }

}


loginBtn?.addEventListener("click", logIn);