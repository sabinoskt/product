from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import users, produtos

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [users.users_router, produtos.produtos_router]

for router in routers:
    app.include_router(router)

