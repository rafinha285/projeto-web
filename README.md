# Guia de Inicializacao do Projeto

Este guia explica como configurar o banco de dados PostgreSQL localmente e iniciar o projeto.

## Requisitos
* Java JDK 21
* PostgreSQL instalado localmente
* Maven (ou uso do mvnw incluso)

## 1. Configurar o Banco de Dados
1. Acesse o console do seu PostgreSQL (ou uma ferramenta como pgAdmin/DBeaver).
2. Crie um banco de dados chamado `projetoweb`:
   ```sql
   CREATE DATABASE projetoweb;
   ```

## 2. Configurar Variavel de Ambiente
A aplicacao precisa da senha do banco de dados para conectar. Defina a variavel `DB_PASSWORD` no seu terminal antes de rodar o projeto:

* No Windows (PowerShell):
  ```powershell
  $env:DB_PASSWORD="sua_senha_do_postgres"
  ```
* No Windows (Prompt de Comando - CMD):
  ```cmd
  set DB_PASSWORD=sua_senha_do_postgres
  ```
* No Linux / macOS:
  ```bash
  export DB_PASSWORD="sua_senha_do_postgres"
  ```

## 3. Iniciar a Aplicacao

### Via Terminal
Execute o comando correspondente ao seu sistema operacional na pasta raiz do projeto:

* Windows (PowerShell/CMD):
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```
* Linux / macOS:
  ```bash
  ./mvnw spring-boot:run
  ```

### Via IDE (IntelliJ / VS Code / Eclipse)
1. Importe o projeto como Maven.
2. Defina a variavel de ambiente `DB_PASSWORD` com a senha do seu banco de dados nas configuracoes de execucao da IDE.
3. Execute a classe principal `br.utfpr.projetoweb.ProjetoWebApplication`.

## 4. Acesso
A aplicacao estara disponivel em `http://localhost:8080`.

Um usuario administrador padrao e criado automaticamente pelas migracoes do Flyway:
* Usuario: teste@admin.com
* Senha: admin
