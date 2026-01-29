from argon2.exceptions import VerifyMismatchError, InvalidHash
from fastapi import APIRouter, FastAPI, status, HTTPException, Response

from fastapi.params import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from fastapi.responses import Response

# from logs.info import info
from database_mysql.crud import Users as Usuarios
from argon2 import PasswordHasher

from datetime import datetime, timezone, timedelta
from api.schemas import Create, Login, UpdatePassword, CreateUsersRole, Update

app = FastAPI()
router = APIRouter()

ph = PasswordHasher(time_cost=3, memory_cost=65536, parallelism=4)


def is_success(is_true: bool) -> str:
    return "(SUCESSO)" if is_true else "(SEM SUCESSO)"


SECRET_KEY = "sua_chave_secreta_super_segura"

security = HTTPBearer()


def criar_token(user_id, username):
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_id,
        "username": username,
        "iat": now,
        "exp": now + timedelta(hours=1),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


def validar_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


def serialize_user(rows):
    return [
        {
            "id": row["user_id"],
            "first_name": row["first_name"],
            "last_name": row["last_name"],
            "date_of_birth": row["date_of_birth"],
            "email": row["email"],
            "username": row["username"],
            "active": row["active"],
            "created_at": row["created_at"],
            "role": {"id": row["role_id"], "name": row["role_name"]},
        }
        for row in rows
    ]


@router.get("/read_users")
def read_users():
    usuarios = Usuarios()
    usuarios = usuarios.get_all()
    if not usuarios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return serialize_user(usuarios)


@router.post("/create_user")
def create_user(user: Create, user_logado=Depends(validar_token)):
    password = ph.hash(user.password)
    usuario = Usuarios()
    usuario.create(
        user.first_name,
        user.last_name,
        user.date_of_birth,
        user.email,
        user.username,
        password,
    )
    return Response(status_code=status.HTTP_201_CREATED)


@router.post("/login_user")
def login(data: Login, response: Response):
    get_user = Usuarios()
    user = get_user.login(data.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário não existe"
        )

    try:
        username_correto = user["username"] == data.username

        try:
            senha_correta = ph.verify(user["password"], data.password)
        except (VerifyMismatchError, InvalidHash):
            senha_correta = False

        if username_correto and senha_correta:
            token = criar_token(user["id"], user["username"])

            return {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "token": token,
            }

        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuário ou Senha incorreta",
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar login {type(e).__name__}: {e}",
        )


@router.put("/update_senha/{id}")
def alterar_senha(id: int, data: UpdatePassword, user_logado=Depends(validar_token)):
    get_user = Usuarios()
    user = get_user.get_user_by_id(id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )

    try:
        try:
            senha_correta = ph.verify(user["password"], data.current_password)
        except (VerifyMismatchError, InvalidHash):
            senha_correta = False

        if not senha_correta:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha atual incorreta"
            )

        if get_user.alterar_senha(ph.hash(data.new_password), id):
            return Response(status_code=status.HTTP_200_OK)
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao alterar senha",
            )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Erro na verificação: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/get_role")
def get_role():
    role = Usuarios()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return role.get_role_all()


@router.get("/get_users_role")
def get_users_role():
    users_role = Usuarios()
    if not users_role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return users_role.users_role_all()


@router.post("/createUsersRole")
def create_users_role(urr: CreateUsersRole, user_logado=Depends(validar_token)):
    usersrole = Usuarios()
    try:
        usersrole.create_users_role(urr.role_id, urr.user_id)
        return HTTPException(status_code=status.HTTP_201_CREATED)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Erro ao criar: {str(e)}"
        )


@router.put("/updateUsersRole/{id}")
def update_users_role(
        id: int, urr: CreateUsersRole, user_logado=Depends(validar_token)
):
    usersrole = Usuarios()
    user = Usuarios().get_user_by_id(id)
    role = Usuarios().get_role_by_id(urr.role_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não existe ou ID usuário não existe",
        )

    if role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Role não existe ou ID de role não existe",
        )

    try:
        usersrole.update_users_role(urr.role_id, id)
        return HTTPException(status_code=status.HTTP_200_OK)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Erro ao atualizar: {str(e)}",
        )


@router.put("/updateUser/{id}")
def update_user(id: int, data: Update, user_logado=Depends(validar_token)):
    user = Usuarios()
    user_by_id = user.get_user_by_id(id)

    if user_by_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não existe ou ID usuário não existe",
        )

    try:
        user.update_users(data, id)
        return HTTPException(status_code=status.HTTP_200_OK)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao atualizar: {str(e)}",
        )

# @router.delete("/delete_user/{index}")
# def delete_user(index: int):
#     users = is_active(dados_users)
#     for u in users:
#         if u.id == index:
#             dados_users.remove(u)
#             info(f"{is_success(True)} - deletado com sucesso")
#             return Response(status_code=status.HTTP_204_NO_CONTENT)
#     info(f"{is_success(False)} - Error ao deletar")
#     raise HTTPException(status_code=404, detail="index nao encontrada")
