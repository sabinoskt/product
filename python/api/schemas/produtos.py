from pydantic import BaseModel, field_validator
from decimal import Decimal

class CreateProduto(BaseModel):
    nome: str
    preco: Decimal
    descricao: str

    @field_validator("descricao")
    def limpar_texto(cls, v):
        return v.replace("\n", ' ').replace("\r", ' ')
