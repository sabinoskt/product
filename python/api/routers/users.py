from argon2.exceptions import VerifyMismatchError, InvalidHash
from infrastructure.security.password_hasher import Hasher
from fastapi import APIRouter, status, HTTPException
from fastapi.params import Depends
from fastapi.responses import Response
# from logs.info import info
from infrastructure.database.mysql.users_repository import Users as Usuarios
from api.schemas.users import Create, Update, Login, UpdatePassword, CreateUsersRole
from infrastructure.security.jwt_service import validar_token, criar_token

users_router = APIRouter()


def is_success(is_true: bool) -> str:
    return "(SUCESSO)" if is_true else "(SEM SUCESSO)"


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


def serialize_exists(rows):
    return [{"email": row["email"], "username": row["username"]} for row in rows]


@users_router.get("/read_users", tags=["usuários"])
def read_users():
    usuarios = Usuarios()
    usuarios = usuarios.get_all()

    if not usuarios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return serialize_user(usuarios)


@users_router.post("/create_user", tags=["usuários"])
def create_user(user: Create):
    ph = Hasher()
    password = ph.senha_crypto(user.password)
    usuarios = Usuarios()
    email = Usuarios().get_email(user.email)
    username = Usuarios().get_username(user.username)

    try:
        if email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="E-mail já cadastrado"
            )
        if username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Usuário já existe"
            )

        usuarios.create(
            user.first_name,
            user.last_name,
            user.date_of_birth,
            user.email,
            user.username,
            password,
        )

        return Response(status_code=status.HTTP_201_CREATED)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@users_router.post("/login_user", tags=["usuários"])
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
            ph = Hasher()
            senha_correta = ph.verificar_senha(user["password"], data.password)
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


@users_router.put("/update_senha/{id}", tags=["usuários"])
def update_password(id: int, data: UpdatePassword, user_logado=Depends(validar_token)):
    get_user = Usuarios()
    user = get_user.get_user_by_id(id)
    ph = Hasher()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )

    try:
        try:
            senha_correta = ph.verificar_senha(user["password"], data.current_password)
        except (VerifyMismatchError, InvalidHash):
            senha_correta = False

        if not senha_correta:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Senha atual incorreta"
            )

        if get_user.update_senha(ph.senha_crypto(data.new_password), id):
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


@users_router.get("/get_role", tags=["usuários"])
def get_role():
    role = Usuarios()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return role.get_role_all()


@users_router.get("/get_users_role", tags=["usuários"])
def get_users_role():
    users_role = Usuarios()
    if not users_role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return users_role.users_role_all()


@users_router.post("/createUsersRole", tags=["usuários"])
def create_users_role(urr: CreateUsersRole, user_logado=Depends(validar_token)):
    usersrole = Usuarios()
    try:
        usersrole.create_users_role(urr.role_id, urr.user_id)
        return Response(status_code=status.HTTP_201_CREATED)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Erro ao criar: {str(e)}"
        )


@users_router.put("/updateUsersRole/{id}", tags=["usuários"])
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
        return Response(status_code=status.HTTP_200_OK)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,

            detail=f"Erro ao atualizar: {str(e)}",
        )


@users_router.put("/updateUser/{id}", tags=["usuários"])
def update_user(id: int, data: Update, user_logado=Depends(validar_token)):
    usuarios = Usuarios()
    usuario_data = usuarios.get_user_by_id(id)

    if usuario_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não existe ou ID usuário não existe",
        )

    try:
        usuarios.update_user(data, id)
        return Response(status_code=status.HTTP_200_OK)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao atualizar: {str(e)}",
        )


@users_router.delete("/delete_user/{id}", tags=["usuários"])
def delete_user(id: int, user_logado=Depends(validar_token)):
    usuarios = Usuarios()
    usuario_data = usuarios.get_user_by_id(id)

    if usuario_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ID não encontrada ou ID não existe",
        )

    try:
        usuarios.delete_user(id)
        return Response(status_code=status.HTTP_200_OK)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao atualizar: {str(e)}",
        )
