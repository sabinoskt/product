document.addEventListener("DOMContentLoaded", async () => {
    const includes = document.querySelectorAll("[data-include]");

    for (const element of includes) {
        const file = element.getAttribute("data-include");
        try {
            const response = await fetch(file);
            const html = await response.text();
            element.innerHTML = html;

            if (window.showUsernameLogin) {
                window.showUsernameLogin();
            }

        } catch (error) {
            console.error(`Erro ao carregar ${file}: ${error}`);
            element.innerHTML = `<p style="color: red;"> Erro ao carregar ${file}</p>`;
        }
    }
});
