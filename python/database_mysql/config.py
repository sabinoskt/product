import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

class MySQL:
    def __init__(self):
        self.host = os.getenv("DB_HOST")
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASSWORD")
        self.database = os.getenv("DB_NAME")
        self.auth_plugin = os.getenv("DB_AUTH_PLUGIN")
        self.allow_local_infile = os.getenv("DB_ALLOW_LOCAL_INFILE", "False").lower() == "true"
        self.conn = None
        
        if not all([self.host, self.user, self.password, self.database]):
            raise ValueError("Variáveis de ambiente do banco não configuradas")

    def conectar(self):
        if self.conn is None or not self.conn.is_connected():
            self.conn = mysql.connector.connect(
                host = self.host,
                user = self.user,
                password = self.password,
                database = self.database,
                auth_plugin = self.auth_plugin,
                allow_local_infile = self.allow_local_infile
            )
        return self.conn

    def desconectar(self):
        if self.conn and self.conn.is_connected():
            self.conn.close()
