
## Instalação

### Ambiente para desenvolvimento

Baixar Node.js[Node.js](https://nodejs.org/en/) <br/>
Baixar Postgres[Postgres](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) 

### Criando o banco de dados

Crie um database no SGBD postgres, e execute o seguinte script para criação das tabelas da aplicação


```sql
CREATE TABLE administrador (
  id serial,
  nome VARCHAR(255) NULL,
  cpf VARCHAR(255) NULL,
  senha TEXT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE estado (
  id serial,
  nome VARCHAR(255),
  uf CHAR(2),
  PRIMARY KEY(id)
);

CREATE TABLE cidade (
  id serial,
  estado_id INTEGER,
  nome VARCHAR(255),
  PRIMARY KEY(id),
  foreign key(estado_id) references estado(id)
);

CREATE TABLE usuario (
  id serial,
  nome VARCHAR(255),
  telefone VARCHAR(20),
  email VARCHAR(60),
  idade INTEGER,
  peso REAL,
  etinia VARCHAR(80),
  PRIMARY KEY(id)
);

CREATE TABLE endereco (
  id serial,
  cidade_id INTEGER ,
  usuario_id INTEGER,
  endereco TEXT,
  numero INTEGER,
  complemento VARCHAR(255),
  cep CHAR(9),
  PRIMARY KEY(id),
  foreign key(usuario_id) references usuario(id),
  foreign key(cidade_id) references cidade(id)
);

insert into administrador values(0, 'Teste', '000.000.000-10',md5('Marc9951'));
```

### Configurando conexão com banco de dados

Para configurar a conexão com banco de dados, você precisar ir na pasta 'src/config' no arquivo 'database.config.ts'

```js
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    database: 'teste_pr',
    port: 5433
```

informe o nome do seu database e os dados de conexão do seu database.

## Executando aplicação

Para executar à aplicação, você precisa instalar as dependencias.

Execute o seguinte comando:

```bash
$ npm install
```

Ao finalizar o processo de instalação das dependencias, execute o comando para subir aplicação:

```bash
$ npm start
```

Você já pode acessar aplicação. Pórem, será necessário utilizar o software ou extensão chamado "Postman", para testar os endpoint da aplicação.

Baixar Postman [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=pt-BR) 


## Executando testes automatizados da aplicação REST API

Para rodar os teste automatizados, execute o seguinte comando:

```bash
$ npm jest
```

[Exemplo tela](./tela_teste_exemplo.PNG)
