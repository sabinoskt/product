from pydantic import BaseModel


class Create(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str
    email: str
    username: str
    password: str


class Update(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str
    email: str
    username: str
    active: bool


class Login(BaseModel):
    username: str
    password: str


class UpdatePassword(BaseModel):
    current_password: str
    new_password: str


class CreateUsersRole(BaseModel):
    user_id: int
    role_id: int
