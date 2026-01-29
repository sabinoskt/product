import userService from "../js/src/services/userService.js";

function Sistema_login() {
    const username = document.querySelector(".username");
    const password = document.querySelector(".password");
    const btnLogin = document.querySelector(".btn-login");
    const span = document.querySelector(".show-error");

    this.inicia = () => {
        this.executar();
    }

    this.executar = () => {
        if (!btnLogin) return;

        btnLogin.addEventListener("click", async event => {
            event.preventDefault();
            span.innerText = "";
            span.style.marginLeft = "";

            try {
                const isLogin = await userService.login(username.value, password.value)

                if (isLogin === null) {
                    span.innerText = "Senha ou Usuário incorreta";
                    return;
                } else {
                    window.location.href = "home/home.html";
                }
            } catch (error) {
                span.style.marginLeft = "10px";
                span.innerText = error.message;
            }
        });
    }
}

const sistemaLogin = new Sistema_login();
sistemaLogin.inicia();
