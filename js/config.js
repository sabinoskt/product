import userService from "../js/src/services/userService.js";
import { validConfig } from "./validar_inputs.js";

function SistemaConfig() {
    this.inicia = () => {
        this.executar();
    }

    this.executar = () => {
        window.addEventListener("DOMContentLoaded", () => {
            const token = localStorage.getItem("token");

            if (!token) window.location.href = "/login.html";
        });

        const btnPerfis = document.querySelector(".btn-perfis");
        const btnSenhaSeguranca = document.querySelector(".btn-senha-seguranca");
        const btnDadosPessoais = document.querySelector(".btn-dados-pessoais");

        if (!btnPerfis || !btnSenhaSeguranca || !btnDadosPessoais) return;

        const main = document.createElement("main");
        main.className = "content";
        document.body.appendChild(main);

        const footer = document.querySelector('[data-include="global/footer.html"]');

        if (footer) {
            document.body.insertBefore(main, footer);
        } else {
            document.body.appendChild(main);
        }


        const statusResult = (statusCode, type, color) => {
            let divToastBox = document.querySelector(".toastbox");
            
            if (!divToastBox) {
                divToastBox = document.createElement("div");
                divToastBox.className = "toastbox";
                if (main) document.body.insertBefore(divToastBox, main);
            }

            divToastBox.innerHTML = "";

            const toast = document.createElement("div");
            toast.classList.add("toast", type);
            toast.innerText = statusCode;
            toast.style.color = color;
            divToastBox.appendChild(toast);

            setTimeout(() => {
                toast.remove();
                if (divToastBox.children.length === 0) divToastBox.remove();
            }, 6000);
        }

        const bloco = (classe, texto) => {
            const div = document.createElement("div");
            div.className = classe;

            const span = document.createElement("span");
            span.innerText = texto;

            div.appendChild(span);
            return div;
        }

        const divPerfil = bloco("perfis-conteiner", "Perfis");
        const divSenhaSeguranca = bloco("senha-seguranca-conteiner", "Senha e segurança");
        const divDadosPessoais = bloco("dados-pessoais-conteiner", "Dados Pessoais");


        const username = async () => {
            const userStorage = JSON.parse(localStorage.getItem("user"));

            if (!userStorage.id) return;

            const users = await userService.getAll();
            const user = users.find(user => user.id == userStorage.id);

            const h1 = document.createElement("h1");
            h1.className = "title-user"
            h1.innerText = user.username;

            divPerfil.append(h1);

        }

        username();

        const senhaSeguranca = () => {
            const userStorage = JSON.parse(localStorage.getItem("user"));

            if (!userStorage.id) return;

            divSenhaSeguranca.innerHTML = "<span class='senhaSeguranca'>Senha e segurança</spna>";

            const form = document.createElement("form");
            form.className = "formulario";

            const inputSenhaAtual = document.createElement("input");
            const inputNovaSenha = document.createElement("input");
            const inputRedigiteSenhaNova = document.createElement("input");
            const btnAlterarSenha = document.createElement("button");

            inputSenhaAtual.placeholder = "Senha atual";
            inputNovaSenha.placeholder = "Nova senha";
            inputRedigiteSenhaNova.placeholder = "Redigite a nova senha";

            btnAlterarSenha.className = "btnAlterarSenha";
            btnAlterarSenha.innerText = "Alterar senha";

            inputSenhaAtual.className = "senha-atual";
            inputNovaSenha.className = "senha-nova";
            inputRedigiteSenhaNova.className = "redigite-senha-nova";

            const inputs = [inputSenhaAtual, inputNovaSenha, inputRedigiteSenhaNova, btnAlterarSenha];

            inputs.forEach(input => {
                form.append(input);
            });

            divSenhaSeguranca.appendChild(form);

            const clickAlterarSenha = document.querySelector(".btnAlterarSenha");

            const senhaAtual = document.querySelector(".senha-atual");
            const novaSenha = document.querySelector(".senha-nova");
            const redigiteNovaSenha = document.querySelector(".redigite-senha-nova");

            if (!clickAlterarSenha) return;

            const inputsClear = () => {
                senhaAtual.value = "";
                novaSenha.value = "";
                redigiteNovaSenha.value = "";
            }

            clickAlterarSenha.addEventListener("click", async e => {
                e.preventDefault();

                if (validConfig(senhaAtual.value, novaSenha.value, redigiteNovaSenha.value)) {
                    try {
                        const result = await userService.updatePassword(senhaAtual.value, novaSenha.value, id);

                        if (result.success) {
                            statusResult("success", "success", "green");
                            inputsClear();
                        } else {
                            statusResult(result.message, "error", "red");
                        }

                    } catch (error) {
                        statusResult(error.message, "error", "red");
                    }

                } else {
                    statusResult("Entrada inválida, verifique novamente", "invalid", "orange");
                    return;
                };
            });
        }

        const dataFormatada = (nasc) => {
            const dataString = nasc;
            const data = new Date(dataString);
            return data.toLocaleDateString("pt-BR");
        }

        const dadosPessoais = async () => {
            const userStorage = JSON.parse(localStorage.getItem("user"));

            if (!userStorage.id) return;

            const users = await userService.getAll();
            const user = users.find(user => user.id == userStorage.id);

            const dados = {
                "Informações de contato": user.email,
                "Data de nascimento": dataFormatada(user.date_of_birth)
            };

            divDadosPessoais.innerHTML = "<span class='titulo'>Dados pessoais</span>";

            const divGrid = document.createElement("div");
            divGrid.className = "grid"

            const hr = document.createElement("hr");

            Object.entries(dados).forEach(([chave, valor]) => {
                const div = document.createElement("div");

                const spanChave = document.createElement("span");
                const spanValor = document.createElement("span");

                spanChave.innerText = chave;
                div.append(spanChave);

                spanValor.innerText = valor;
                div.append(spanValor);

                divGrid.appendChild(hr);

                divGrid.appendChild(div);

                divDadosPessoais.append(divGrid);
            });
        }

        main.replaceChildren(divPerfil);

        btnPerfis.addEventListener("click", event => {
            history.pushState(null, "", `config.html?section=perfis`);
            event.preventDefault();
            main.replaceChildren(divPerfil);
        });

        btnSenhaSeguranca.addEventListener("click", event => {
            const id = localStorage.getItem("id");
            history.pushState(null, "", `config.html?section=senha-seguranca`);
            event.preventDefault();
            main.replaceChildren(divSenhaSeguranca);
            senhaSeguranca();
        });

        btnDadosPessoais.addEventListener("click", event => {
            history.pushState(null, "", `config.html?section=dados-pessoais`);
            event.preventDefault();
            main.replaceChildren(divDadosPessoais);
            dadosPessoais();
        });
    }
}

const sistema_config = new SistemaConfig();
sistema_config.inicia();
