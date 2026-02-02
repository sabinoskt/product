from fastapi import APIRouter, HTTPException, status
from api.schemas.produtos import CreateProduto
from infrastructure.database.mysql.produtos_repository import Produtos

produtos_router = APIRouter()


@produtos_router.post("/create", tags=["produtos"])
def create_produto(produto: CreateProduto):
    prod = Produtos()
    try:
        prod.create(produto)
        return HTTPException(status_code=status.HTTP_201_CREATED)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@produtos_router.get("/getProdutos", tags=["produtos"])
def get_produtos():
    try:
        produtos = Produtos().get_all()

        if not produtos:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produtos nao encontrado")

        return produtos

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
