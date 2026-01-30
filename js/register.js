import userService from "../js/src/services/userService.js";
import Validation from "./validar_inputs.js";

function Register() {
    this.inicia = () => {
        this.create();
    }

    const selector = (query) => {
        return document.querySelector(query);
    }

    const inputNome = selector(".nome");
    const inputSobrenome = selector(".sobrenome");
    const inputNascimento = selector(".nascimento");
    const inputEmail = selector(".e-mail");
    const inputUser = selector(".user");
    const inputPassword = selector(".password");
    const inputPasswordAgain = selector(".password-again");

    const btnCreate = selector(".btn-create");

    const data = () => {
        const user = {
            active: true,
            first_name: inputNome.value,
            last_name: inputSobrenome.value,
            date_of_birth: inputNascimento.value,
            email: inputEmail.value,
            username: inputUser.value,
            password: inputPassword.value,
        }

        return user;
    }

    this.create = () => {
        if (!btnCreate) return;

        btnCreate.addEventListener("click", async event => {
            event.preventDefault();

            const passwordAgain = inputPasswordAgain.value;
            const user = data();

            const register = new Validation()

            if (register.validarRegister(user, passwordAgain)) {
                await userService.create(user);
                window.location.href = "login.html";
            }
        });
    }
}

const create = new Register();
create.inicia();
