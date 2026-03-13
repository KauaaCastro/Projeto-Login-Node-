# 🚀 Login System: Node.js + Docker + MySQL

Este projeto consiste em uma aplicação de autenticação robusta, desenvolvida em **Node.js**, utilizando **Docker** para orquestração de serviços e **MySQL** como banco de dados persistente. A arquitetura foi desenhada para ser isolada, escalável e de fácil deploy.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js (Framework Express)
- **Frontend:** HTML5 e CSS3 (Arquivos estáticos)
- **Banco de Dados:** MySQL 8.0
- **Infraestrutura:** Docker e Docker Compose

---

## 📂 Estrutura do Projeto

A organização de pastas segue as melhores práticas de separação de responsabilidades:

```text
├── public/              # Arquivos front-end (estáticos)
│   ├── css/
│   │   └── style.css    # Estilização da interface
│   └── login.html       # Tela de autenticação
├── src/                 # Código-fonte do servidor
│   └── server.js        # Core da aplicação e rotas
├── .dockerignore        # Filtro de arquivos para o Docker
├── .gitignore           # Filtro de arquivos para o Git
├── Dockerfile           # Receita da imagem Node.js
├── docker-compose.yml   # Orquestração de serviços (App + DB)
└── package.json         # Gerenciador de dependências e scripts
```

⚙️ Configuração e Execução
Para rodar este projeto localmente, você precisará ter o Docker e o Docker Compose instalados.

1. Clonar o repositório

   ```text
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Subir os Containers

O comando abaixo irá baixar as imagens necessárias, configurar as redes virtuais e iniciar o banco de dados e a aplicação:

```
docker-compose up -d
```

3. Acessar a Aplicação

Após o deploy dos containers, a aplicação estará disponível em:

```
http://localhost:8000
```

🏗️ Arquitetura de Infraestrutura

O projeto utiliza o Docker Compose para garantir que o ambiente de desenvolvimento seja idêntico ao de produção.

Serviço db: Container MySQL configurado com volumes persistentes para que os dados dos usuários não sejam perdidos ao reiniciar os containers.

Serviço app: Container Node.js que se comunica com o banco através da rede interna do Docker, utilizando o hostname db.

📝 Próximos Passos (Roadmap)

[x] Configuração da estrutura de pastas.

[x] Dockerização da aplicação e banco de dados.

[x] Implementar lógica de conexão mysql2 no server.js.

[x] Criar script de migração para a tabela users.

[x] Validar credenciais de login via POST.

[x] Implementar criptografia de senhas (BCrypt).


📝 Passos de finalização 

[] Tela de registro de usuário 

[] Tela de perfil bonita e adequada
