import userService from "../js/src/services/userService.js";

function ListaUsers() {
    this.executar = () => {
        window.addEventListener("DOMContentLoaded", () => {
            const token = localStorage.getItem("token");

            if (!token) window.location.href = "/login.html";
        });
    }

    const username = async () => {
        const userStorage = JSON.parse(localStorage.getItem("user"));

        if (!userStorage.id) return;

        const users = await userService.getAll();

        const user = users.find(user => user.id == userStorage.id);

        const span = document.querySelector(".username");
        span.innerText = user.username;

        return user;
    }

    username();

    const btnConfig = document.querySelector(".settings");
    btnConfig.addEventListener("click", () => {
        window.location.href = "config/config.html";
    });

    const showUsernameLogin = () => {
        const login = document.querySelector(".login");
        const username = localStorage.getItem("username");

        if (username) {
            login.innerText = username;
            login.href = "#";
        } else {
            login.innerText = "Login";
            login.href = "/login.html";
        }
    }

    window.showUsernameLogin = showUsernameLogin;

    const dataFormatada = (data_criada) => {
        const dataString = data_criada;
        const data = new Date(dataString);
        return data.toLocaleDateString("pt-BR");
    }

    const formatarPessoa = (user) => {
        const id = user.id ? user.id : "";
        const first_name = user.first_name ? user.first_name : "";
        const last_name = user.last_name ? user.last_name : "";
        const username = user.username ? user.username : "";
        const email = user.email ? user.email : "";
        const active = user.active ? "true" : "false";
        const data_criada = dataFormatada(user.created_at);
        const role = user.role.name ? user.role.name : "";

        return {
            id,
            nomeCompleto: `${first_name} ${last_name}`.trim(),
            username,
            email,
            role,
            active,
            data_criada,
        };
    }

    this.listar = async () => {
        this.executar();

        history.pushState(null, "", `home.html`);
        const userStorage = JSON.parse(localStorage.getItem("user"));
        const welcome = document.querySelector(".welcome");
        welcome.innerText = `Bem-vindo(a) - ${userStorage.username}`;

        const btnUsers = document.querySelector(".users");
        if (!btnUsers) return;

        const main = document.querySelector(".main");

        const divDropDown = document.createElement("div");
        divDropDown.className = "content-dropdwon";

        const users = await userService.getAll();

        const isAdmin = users.some(user => user.id == userStorage.id && user.role.name === "admin");

        btnUsers.disabled = !isAdmin;

        btnUsers.addEventListener("click", () => {
            history.pushState(null, "", `home.html?section=usuarios`);

            if (users.length === 0) return;

            main.innerHTML = "";

            const table = document.createElement("table");
            table.className = "table";

            const caption = document.createElement("caption");
            caption.innerText = "lista de usuários";

            table.appendChild(caption);

            const tituloColuna = () => {
                const tr = document.createElement("tr");
                const tituloColuna = [
                    "id", "Nome", "Usuário", "E-mail", "Papel", "Ativo", "Data Criada", "Ações"
                ];

                tituloColuna.forEach(titulo_coluna => {
                    const th = document.createElement("th");
                    th.innerText = titulo_coluna;
                    tr.append(th);
                });

                table.appendChild(tr);
            }

            tituloColuna();

            users.forEach(user => {
                const tr = document.createElement("tr");
                const dados = formatarPessoa(user);

                Object.values(dados).forEach(valor => {
                    const td = document.createElement("td");
                    td.innerText = valor;
                    tr.appendChild(td);
                });

                const tdAcoes = document.createElement("td");
                tdAcoes.classList = "acoes";

                const editar = document.createElement("button");
                const excluir = document.createElement("button");

                editar.classList = "editar";
                editar.innerText = "editar";

                editar.addEventListener("click", () => {
                    window.location.href = `detail.html?id=${dados.id}`;
                });

                excluir.classList = "excluir";
                excluir.innerText = "excluir";

                excluir.addEventListener("click", async () => {
                    if (await userService.delete(dados.id)) this.listar();
                });

                tdAcoes.append(editar, excluir);

                tr.append(tdAcoes);
                table.appendChild(tr)
            });
            main.appendChild(table);
        });
    }

    const btnSair = document.querySelector(".sair");

    if (!btnSair) return;

    btnSair.addEventListener("click", () => {
        window.localStorage.clear();
        window.location.href = "/login.html";
    });

}

const lista = new ListaUsers();
lista.listar();
