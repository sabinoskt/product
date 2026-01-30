class Validation {
    isText(valor) {
        return isNaN(valor) && valor.trim() !== "";
    }

    isEmail(email) {
        const regex = /^[a-z0-9._%+-]+@[a-z0-9-]+\.(?:[a-z]{2,})(?:\.[a-z]{2})?$/;
        return regex.test(email);
    }

    consultaSeletor(query) {
        return document.querySelector(query);
    }

    errorRegister() {
        const error = {
            erroNome: this.consultaSeletor(".erro-nome"),
            erroSobrenome: this.consultaSeletor(".erro-sobrenome"),
            erroDate: this.consultaSeletor(".erro-data"),
            erroEmail: this.consultaSeletor(".erro-email"),
            erroUsername: this.consultaSeletor(".erro-user"),
            erroPassword: this.consultaSeletor(".erro-password"),
            erroPasswordAgain: this.consultaSeletor(".erro-password-again")
        }
        return error;
    }

    errorClear() {
        const error = this.errorRegister();
        error.erroNome.innerText = "";
        error.erroSobrenome.innerText = "";
        error.erroDate.innerText = "";
        error.erroEmail.innerText = "";
        error.erroUsername.innerText = "";
        error.erroPassword.innerText = "";
        error.erroPasswordAgain.innerText = "";
    }

    messageError() {
        const message = {
            field: "Este campo é obrigatório",
            name: "Nome nao pode ser número",
            date: "Nao pode ser data futura",
            email: "E-mail incorreta",
            password: "A senha nao pode conter espaços",
            passwordAgain: "As senhas precisam ser iguais"
        }
        return message;
    }

    validarCampo(valor, errorElement, validacoes) {
        for (const validacao of validacoes) {
            if (!validacao.condicao(valor)) {
                errorElement.innerText = validacao.message;
                return false;
            }
        }
        return true
    }

    anoFormatado(nasc) {
        const anoAtual = new Date().getFullYear();
        const ano = nasc.split('-')[0]

        return {
            anoAtual: anoAtual,
            ano: ano
        };
    }

    validarRegister(data, psswdAgain) {
        this.errorClear();

        const error = this.errorRegister();
        const message = this.messageError();

        const nome = !data.first_name.trim() ? "" : data.first_name.trim();
        const sobrenome = !data.last_name.trim() ? "" : data.last_name.trim();
        const nascimento = !data.date_of_birth.trim() ? "" : data.date_of_birth.trim();
        const email = !data.email.trim() ? "" : data.email.trim();
        const userName = !data.username.trim() ? "" : data.username.trim();
        const password = !data.password.trim() ? "" : data.password.trim();
        const passwordAgain = !psswdAgain.trim() ? "" : psswdAgain.trim();

        const anoFormatado = this.anoFormatado(nascimento);

        if (!nome && !sobrenome && !nascimento && !email && !userName && !password && !passwordAgain) {
            error.erroNome.innerText = message.field;
            error.erroSobrenome.innerText = message.field;
            error.erroDate.innerText = message.field;
            error.erroEmail.innerText = message.field;
            error.erroUsername.innerText = message.field;
            error.erroPassword.innerText = message.field;
            error.erroPasswordAgain.innerText = message.field;
            return false
        }

        if (!this.validarCampo(nome, error.erroNome, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => this.isText(v), message: message.name }
        ])) return false;

        if (!this.validarCampo(sobrenome, error.erroSobrenome, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => this.isText(v), message: message.name }
        ])) return false;

        if (!this.validarCampo(nascimento, error.erroDate, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: () => anoFormatado.ano <= anoFormatado.anoAtual, message: message.date }
        ])) return false;

        if (!this.validarCampo(email, error.erroEmail, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => this.isEmail(v), message: message.email }
        ])) return false;

        if (!this.validarCampo(userName, error.erroUsername, [
            { condicao: (v) => v !== "", message: message.field },
        ])) return false;

        if (!this.validarCampo(password, error.erroPassword, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => !v.includes(' '), message: message.password }
        ])) return false;

        if (!this.validarCampo(passwordAgain, error.erroPasswordAgain, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => !v.includes(' '), message: message.password },
            { condicao: (v) => v === password, message: message.passwordAgain }
        ])) return false;

        return true;
    }

    validConfig(current_password, password, passwordAgain) {
        if (!this.validarCampo(current_password, null, [
            { condicao: (v) => v !== "", message: "" },
            { condicao: (v) => !v.includes(' '), message: "" }
        ])) return false;

        if (!this.validarCampo(password, null, [
            { condicao: (v) => v !== "", message: "" },
            { condicao: (v) => !v.includes(' '), message: "" }
        ])) return false;

        if (!this.validarCampo(passwordAgain, null, [
            { condicao: (v) => v !== "", message: "" },
            { condicao: (v) => !v.includes(' '), message: "" },
            { condicao: (v) => v === password, message: "" }
        ])) return false;

        return true;
    }

    validDetail(data) {
        const message = this.messageError();
        const anoFormatado = this.anoFormatado(data.date_of_birth);

        if (!this.validarCampo(data.first_name, null, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => this.isText(v), message: message.name }
        ])) return false;

        if (!this.validarCampo(data.last_name, null, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => this.isText(v), message: message.name }
        ])) return false;

        if (!this.validarCampo(data.date_of_birth, null, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: () => anoFormatado.ano <= anoFormatado.anoAtual, message: message.date, message: message.date }
        ])) return false;

        if (!this.validarCampo(data.email, null, [
            { condicao: (v) => v !== "", message: message.field },
            { condicao: (v) => this.isEmail(v), message: message.email }
        ])) return false;

        if (!this.validarCampo(data.username, null, [
            { condicao: (v) => v !== "", message: message.field },
        ])) return false;

        return true;
    }
}

export default Validation;
