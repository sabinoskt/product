import userService from "../js/src/services/userService.js";
import Validation from "./validar_inputs.js";

function Detail() {
    this.executar = async () => {
        window.addEventListener("DOMContentLoaded", () => {
            const token = localStorage.getItem("token");

            if (!token) window.location.href = "/login.html";
        });

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (!id) return;

        const users = await userService.getAll()

        const user = users.find(users => users.id == id);

        const consultaSeletor = (query) => {
            return document.querySelector(query);
        }

        const criarElemento = (elemento) => {
            return document.createElement(elemento);
        }

        const tituloNome = consultaSeletor(".titulo-nome");
        tituloNome.innerText = `${user.first_name} ${user.last_name}`;

        const nome = consultaSeletor(".nome");
        const sobrenome = consultaSeletor(".sobrenome");
        const nascimento = consultaSeletor(".nascimento");
        const email = consultaSeletor(".email");
        const username = consultaSeletor(".username");
        const ativo = consultaSeletor(".check-active");

        const btnSalvar = consultaSeletor(".btn-save");
        const btnSalvarContinuar = consultaSeletor(".btn-save-continue");

        const desativarFormulario = () => {
            nascimento.disabled = true;
            email.disabled = true;
            ativo.disabled = true;
            btnSalvarContinuar.disabled = true;
        }

        const preencherFormulario = (user) => {
            nome.value = user.first_name;
            sobrenome.value = user.last_name;
            nascimento.value = user.date_of_birth;
            email.value = user.email;
            username.value = user.username;
            ativo.checked = user.active;
        }

        const data = () => {
            const user = {
                first_name: nome.value,
                last_name: sobrenome.value,
                date_of_birth: nascimento.value,
                email: email.value,
                username: username.value,
                active: ativo.checked
            }
            return user;
        }

        desativarFormulario();
        preencherFormulario(user);

        const dropdown = consultaSeletor(".dropdown");
        const select = criarElemento("select");

        select.id = "papel";

        const role = await userService.getAllRole();

        const placeholder = criarElemento("option");
        placeholder.value = "";
        placeholder.textContent = "Seleciona o papel";
        placeholder.disabled = true;
        placeholder.selected = true;
        select.appendChild(placeholder);

        role.forEach(role => {
            const option = criarElemento("option");
            option.value = role.id
            option.innerText = role.name;
            select.appendChild(option);
        });

        dropdown.appendChild(select);
        select.value = user.role.id;

        if (!btnSalvar) return;

        const valorInicial = select.value;

        btnSalvar.addEventListener("click", async event => {
            event.preventDefault();

            let isSalva = false;

            const role_id = select.value;

            const role = await userService.getAllUsersRole();

            if (select.value !== valorInicial) {
                role.forEach(role => {
                    if (role.users_id == Number(id)) {
                        if (role.users_id !== Number(id)) {
                            isSalva = userService.createUsersRole(id, role_id);
                        } else {
                            isSalva = userService.updateUsersRole(id, role_id, id);
                        }
                    }
                });
            }

            const user = data();
            const detail = new Validation();

            if (detail.validDetail(user)) {
                isSalva = userService.update(id, user);
            }

            if (isSalva) window.location.href = "./home.html";
        });
    }
}

const iniciar = new Detail();
iniciar.executar();
