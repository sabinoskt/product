import { API_BASE_URL, API_ENDPOINTS } from "../config/api.js";

const userService = {
    getToken: () => {
        return localStorage.getItem("token");
    },

    create: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.createUser}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData)
                }
            );

           if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            return { success: true };

        } catch (error) {
            if (error instanceof TypeError) throw new Error("Servidor fora do ar");
            throw error;
        }
    },

    update: async (id, userData) => {
        const token = userService.getToken();
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.updateUser}/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                }
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            return true;

        } catch (error) {
            if (error instanceof TypeError) throw new Error(error.message);
            throw error;
        }
    },

    delete: async (id) => {
        const token = userService.getToken();
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.deleteUser}/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            return true;

        } catch (error) {
            if (error instanceof TypeError) throw new Error(error.message);
            throw error;
        }
    },

    login: async (username, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                }
            );

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email
            }));

            return data;

        } catch (error) {
            if (error instanceof TypeError) throw new Error("Servidor fora do ar");
            throw error;
        }
    },

    updatePassword: async (currentPassword, newPassword, id) => {
        const token = userService.getToken();
        try {
            const response = await this.request(`/update_senha/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                }
            );

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            return { success: true };
        } catch (erro) {
            throw erro;
        }
    },

    getAll: async () => {
        const token = userService.getToken();
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.users}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/login.html";
                return [];
            }

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(`Erro HTTP: ${erro.detail}`);
            }

            const dados = await response.json();
            return dados || [];

        } catch (error) {
            if (error instanceof TypeError) throw new Error(error.message);
            throw error;
        }
    },

    getAllRole: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.getRole}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            return response.json();

        } catch (error) {
            if (error instanceof TypeError) throw new Error(error.message);
            throw error;
        }
    },

    getAllUsersRole: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.getUsersRole}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.detail);
            }

            return response.json();

        } catch (error) {
            if (error instanceof TypeError) throw new Error(error.message);
            throw error;
        }
    },

    createUsersRole: async (user_id, role_id) => {
        const token = userService.getToken();
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.createUsersRole}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ user_id, role_id }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Erro HTTP: ${response.status}: ${JSON.stringify(error)}`);
            }

            return true;

        } catch (error) {
            if (error instanceof TypeError) throw new Error(error.message);
            throw error;
        }
    },

    updateUsersRole: async (user_id, role_id, id) => {
        const token = userService.getToken();
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.updateUsersRole}/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ user_id, role_id }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Erro HTTP: ${response.status}: ${JSON.stringify(error)}`);
            }

            return true;

        } catch (error) {
            if (error instanceof TypeError) throw new Error(error.message);
            throw error;
        }
    }
};

export default userService;
