from argon2 import PasswordHasher


class Hasher:
    def __init__(self):
        self.ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=4)

    def senha_crypto(self, senha):
        return self.ph.hash(senha)

    def verificar_senha(self, senha1, senha2):
        return self.ph.verify(senha1, senha2)
