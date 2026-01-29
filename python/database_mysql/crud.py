from database_mysql.config import MySQL
import mysql.connector


class Users:
    def __init__(self):
        self.conexao = MySQL()
        self.conn = self.conexao.conectar()

    def get_user_by_id(self, id):
        cursor = None
        query = "select * from users where id = %s"
        values = (id,)

        try:
            cursor = self.conn.cursor(dictionary=True)
            cursor.execute(query, values)
            user = cursor.fetchone()
            cursor.close()
            return user

        except mysql.connector.Error as err:
            print(f"Erro ao buscar usuario: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def get_all(self):
        cursor = None

        try:
            cursor = self.conn.cursor(dictionary=True)

            query_inner_join = """
                               SELECT u.id   as user_id,
                                      u.first_name,
                                      u.last_name,
                                      u.date_of_birth,
                                      u.email,
                                      u.username,
                                      u.active,
                                      u.created_at,

                                      r.id   as role_id,
                                      r.name as role_name
                               FROM users AS u
                                        INNER JOIN users_role ur ON u.id = ur.users_id
                                        INNER JOIN role r ON r.id = ur.role_id; \
                               """

            # query = """
            #     select id, first_name, last_name, date_of_birth, email, username, active, created_at, updated_at from users
            # """

            cursor.execute(query_inner_join)
            rows = cursor.fetchall()
            cursor.close()
            return rows

        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def create(self, name, surname, birth, email, username, password):
        cursor = None
        query = """
                insert into users
                    (first_name, last_name, date_of_birth, email, username, password)
                values (%s, %s, %s, %s, %s, %s) \
                """
        values = (name, surname, birth, email, username, password)

        try:
            cursor = self.conn.cursor()
            cursor.execute(query, values)
            self.conn.commit()
            cursor.close()

        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def login(self, username):
        cursor = None
        query = "select * from users where username = %s"

        try:
            cursor = self.conn.cursor(dictionary=True)
            cursor.execute(query, (username,))
            data = cursor.fetchone()

            return data if data else None

        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def update_senha(self, new_password, id):
        cursor = None
        query = "update users set password = %s where id = %s"
        values = (new_password, id)

        try:
            cursor = self.conn.cursor()
            cursor.execute(query, values)
            self.conn.commit()
            cursor.close()

            return cursor.rowcount > 0

        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def get_role_all(self):
        cursor = None

        try:
            cursor = self.conn.cursor(dictionary=True)
            cursor.execute("select * from role")
            rows = cursor.fetchall()
            cursor.close()
            return rows

        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def users_role_all(self):
        cursor = None

        try:
            cursor = self.conn.cursor(dictionary=True)
            cursor.execute("select * from users_role")
            rows = cursor.fetchall()
            cursor.close()
            return rows
        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def create_users_role(self, user_id, role_id):
        cursor = None
        query = """
                insert into users_role (users_id, role_id)
                values (%s, %s) \
                """
        values = (user_id, role_id)

        try:
            cursor = self.conn.cursor()
            cursor.execute(query, values)
            self.conn.commit()
            cursor.close()

        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def update_users_role(self, role_id, user_id):
        cursor = None
        query = """
                update users_role
                set role_id = %s
                where users_id = %s \
                """
        values = (role_id, user_id)

        try:
            cursor = self.conn.cursor()
            cursor.execute(query, values)
            self.conn.commit()
            cursor.close()

        except mysql.connector.Error as err:
            print(f"Erro ao conectar ou executar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def get_role_by_id(self, id):
        cursor = None
        query = """
                select *
                from role
                where id = %s \
                """
        values = (id,)

        try:
            cursor = self.conn.cursor()
            cursor.execute(query, values)
            row = cursor.fetchone()
            self.conn.commit()
            cursor.close()
            return row

        except mysql.connector.Error as err:
            print(f"Erro ao executar ou conectar: {err}")
            return None
        finally:
            if not self.conexao:
                self.conexao.desconectar()

    def update_users(self, data, id):
        cursor = None
        query = """
                update users
                set first_name = %s,
                last_name = %s,
                date_of_birth = %s,
                email = %s,
                username = %s,
                active = %s
                where id = %s
                """
        values = (
            data.first_name,
            data.last_name,
            data.date_of_birth,
            data.email,
            data.username,
            data.active,
            id,
        )

        try:
            cursor = self.conn.cursor()
            cursor.execute(query, values)
            self.conn.commit()
            cursor.close()
            return True

        except mysql.connector.Error as err:
            if self.conn:
                self.conn.rollback()
            print(f"Erro ao executar ou conectar: {err}")
            raise

        finally:
            if cursor:
                cursor.close()

            if self.conexao:
                self.conexao.desconectar()
