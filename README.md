Propósito

Este projeto não é apenas um CRUD isolado.
Ele foi criado para:
- Consolidar fundamentos de backend com Python
- Trabalhar com banco de dados relacional (MySQL)
- Aplicar boas práticas de organização, segurança e versionamento
- Simular um fluxo real de desenvolvimento Full Stack
- Evoluir o sistema de forma incremental

Funcionalidades

Implementado (Módulo Usuários)
- Cadastro de usuários
- Login de usuários
- Listagem de usuários
- Relacionamento entre usuários e roles
- Separação de camadas (configuração e acesso a dados)
- Configuração segura do banco via variáveis de ambiente (.env)

Em desenvolvimento
- CRUD de produtos
- Relacionamento entre usuários e produtos
- Melhorias na arquitetura do backend
- Integração mais completa com frontend
- Autenticação e controle de acesso

Próximos Passos (Planejamento)
- Migração gradual do frontend para TypeScript
- Implementação de frontend moderno com Angular
- Integração completa frontend (Angular) + backend (Python)
- Padronização de API para consumo por SPA

Estrutura do projeto (simplificada)

```
projeto/
├── css/
├── home/
├── js/
├── python/
│   ├── api/
│   ├── database_mysql/
│   ├── main.py
│   └── requirements.txt
├── .gitignore
├── login.html
├── register.html
└── README.md
```

Tecnologias Utilizadas

Backend
- Python
- MySQL
- mysql-connector-python
- python-dotenv

Frontend
- HTML
- CSS
- JavaScript
- (Planejado: TypeScript e Angular)

Ferramentas
- Git
- GitHub
- VS Code e Pycharm

Boas Práticas Aplicadas
- Nenhuma credencial é versionada
- Uso de .gitignore para proteger dados sensíveis
- Código organizado por responsabilidade
- Versionamento com Git desde o início do projeto

Status do Projeto
Em desenvolvimento ativo
Novas funcionalidades serão adicionadas conforme a evolução dos estudos.
Em desenvolvimento ativo (projeto de estudo e prática contínua).

Autor
Gabriel Wilson
Desenvolvedor Full Stack em formação
Projeto voltado para prática real, aprendizado contínuo e evolução profissional
