// import { login } from "./api/fetchAPI.js"

// export const isLogin = async (username, password) => {
//     const user = await login(username, password);
//     const path = window.location.pathname;

//     console.log("PATH:", path);
//     console.log("USER:", user);
//     console.log("USER é truthy?", !!user);

//     if (user === null) return;

//     if (!user) {
//         console.error("Falha no login: Usuário nao econtrado");
//         return;
//     }

//     if (user && path.includes("/login.html")) {
//         window.location.replace("/projeto/index.html");
//     }
// }
