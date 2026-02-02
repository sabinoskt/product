from infrastructure.database.mysql.config import MySQL
import mysql.connector

class Produtos:
    def __init__(self):
        self.conexao = MySQL()
        self.conn = self.conexao.conectar()

    def create(self, data):
        cursor = None
        try:
            cursor = self.conn.cursor()
            query = "insert into produtos (nome, preco, descricao) values (%s, %s, %s)"
            values = (data.nome, data.preco, data.descricao)
            cursor.execute(query, values)
            self.conn.commit()
            cursor.close()
            return True

        except mysql.connector.Error as err:
            self.conn.rollback()
            raise err

        finally:
            if cursor:
                cursor.close()


    def get_all(self):
        cursor = None
        try:
            cursor = self.conn.cursor(dictionary=True)
            query = "select * from produtos"
            cursor.execute(query)
            rows = cursor.fetchall()
            cursor.close()
            return rows

        except mysql.connector.Error as err:
            self.conn.rollback()
            raise err

        finally:
            if cursor:
                cursor.close()
