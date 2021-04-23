
# Rest API Express.js, Node.js, Typescript e Postgres.

## Instalações.

### Ambiente para desenvolvimento.

Baixar Node.js [Node.js](https://nodejs.org/en/) <br/>
Baixar Postgres [Postgres](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) 

Instalar o Typescript

```bash
$  npm install typescript --save-dev
```

Instalar o Jest

```bash
$  npm install --save-dev jest
```

### Criando o banco de dados.

Crie um database no SGBD postgres, e execute o seguinte script para criação das tabelas da aplicação.


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

### Configurando conexão com banco de dados.

Para configurar a conexão com banco de dados, você precisar ir na pasta 'src/config' no arquivo 'database.config.ts'.

```js
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    database: 'teste_pr',
    port: 5433
```

informe o nome do seu database e os dados de conexão do seu database.

## Executando aplicação.

Para executar à aplicação, você precisa instalar as dependencias.

Execute o seguinte comando:

```bash
$ npm install
```

Ao finalizar o processo de instalação das dependencias, execute o comando para subir aplicação:

```bash
$ npm start
```

Você pode acessar aplicação na URL:

```url
  http://localhost:3000/
```

Você já pode acessar aplicação. Pórem, será necessário utilizar o software ou extensão chamado "Postman" para testar os endpoint da aplicação.

Baixar Postman [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=pt-BR) 


## Executando testes automatizados da aplicação REST API.

Para rodar os teste automatizados, execute o seguinte comando:

```bash
$ npm jest
```

![Exemplo tela](./tela_teste_exemplo.PNG)


## Controllers e Routes(endpoints).

### Observação.

Após obter o token de acesso, não esqueça de enviar no headers da sua requisição.

```json
    {
        "Authorization": "Bearer <TOKEN>",
        "Content-Type":"application/json"
    }
```

## Controller Auth(Autenticação).
    - Obter token de autenticação 
        - (POST) 'api/v1/auth/entrar' 
    
        Exemplo de envio: 

        {
            cpf: "000.000.000-10",
            senha: "Marc9951"
        }
        
        Exemplo de retorno: 

        {
            status: true,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTkxNDU5OTMsImRhdGEiOnsiaWQiOjAsIm5vbWUiOiJNYXJjb3MiLCJjcGYiOiIwMDAuMDAwLjAwMC0xMCJ9LCJpYXQiOjE2MTkxNDIzOTN9.S4R5akIdcWc8K6ax6MvikDFzbHZlX_HD8gYdHVs3nAI",
            administrador: {
                id: 0,
                nome: "Marcos",
                cpf: "000.000.000-10"
            }
        }
        

### Controller Administrador.
    - Administradores (Listar todos administradores)
        - (GET) 'api/v1/administradores'
    - Obter informações de um administrador especifico via "ID" (Irá trazer um único registro)
        - (GET) 'api/v1/administradores?id=:id_do_administrador' 
    - Cadastrar novo administrador
        - (POST) 'api/v1/administradores/salvar' 

        Exemplo de envio body:

        {
            cpf: '000.000.000-11',
            senha: 'Marc9951',
            nome: "Marcos Lopes 2"
        };
            
    - Alterar informações de cadastro do administrador
        - (PUT) 'api/v1/administradores/edit/:id_do_administrador' 

        Exemplo de envio body:
        {
            cpf: '000.000.000-11',
            senha: 'Marc9951',
            nome: "Marcos Lopes (editado)"
        };
                
    - Deletar cadastro do administrador da base de dados
        - (DELETE) 'api/v1/administradores/deletar/:id_do_administrador' 
        
### Controller Usuário.
    - Usuários (Listar todos os usuários)
        - (GET) 'api/v1/usuarios'
    - Obter informações de uma usuário especifico via "ID" (Irá trazer um único registro)
        - (GET) 'api/v1/usuarios?id=:id_do_usuario' 
    - Cadastrar novo usuário
        - (POST) 'api/v1/usuarios/salvar' 

        Exemplo de envio body:

        {
            nome: "Marcos",
            telefone: "(67) 99667 - 8725",
            email: "marcoslopesg7@gmail.com",
            idade: 21,
            peso: 64,
            etinia: "Pardo",
        };
    
    - Alterar informações de cadastro do usuário
        - (PUT) 'api/v1/usuarios/edit/:id_do_usuario' 

        Exemplo de envio body:
        {
            nome: "Marcos",
            telefone: "(67) 99667 - 8725",
            email: "marcoslopesg7@gmail.com",
            idade: 21,
            peso: 64,
            etinia: "Pardo",
        };
        
    - Deletar usuário da base de dados
        - (DELETE) 'api/v1/usuarios/deletar/:id_do_usuario' 

### Controller Estado.
    - Estados (Listar todos os estados)
        - (GET) 'api/v1/estados'
    - Obter informações do estado especifico via "ID", trazendo todas as cidades relacionadas com esse estado.
        - (GET) 'api/v1/estados?id=:id_do_estado' 
    - Cadastrar novo estado
        - (POST) 'api/v1/estados/salvar' 

        Exemplo de envio body:

        {
            nome: 'Mato Grosso Do Sul',
            uf: 'MS'
        };
                
    - Alterar informações do cadastro do estado
        - (PUT) 'api/v1/estados/edit/:id_do_estado' 

        Exemplo de envio body:

        {
            nome: 'Mato Grosso Do Sul(editado)',
            uf: 'MS'
        }
                
    - Deletar estado da base de dados
        - (DELETE) 'api/v1/estados/deletar/:id_do_estado' 
      

### Controller Cidade.
    - Cidades (Listar todas cidades)
        - (GET) 'api/v1/cidades'
    - Obter informações de uma cidade especifica via "ID" (Irá trazer um único registro)
        - (GET) 'api/v1/cidades?id=:id_da_cidade' 
    - Obter informações de uma cidade especifica via "ID" e trazer todos endereços cadastrado naquela cidade
        - (GET) 'api/v1/cidades?id=:id_da_cidade&enderecos=true' 
    - Cadastrar nova cidade
        - (POST) 'api/v1/cidades/salvar' 

        Exemplo de envio body:

        {
            nome: 'Dourados',
            estado_id: null
        };
                
    - Alterar informações do cadastro da cidade
        - (PUT) 'api/v1/cidades/edit/:id_da_cidade' 

        Exemplo de envio body:
        {
            nome: 'Dourados',
            estado_id: null
        };
                
    - Deletar cidade da base de dados
        - (DELETE) 'api/v1/cidades/deletar/:id_da_cidade' 

### Controller Endereço.
    - Endereços (Listar todos endereços)
        - (GET) 'api/v1/enderecos'
    - Obter informações de um endereço especifico via "ID" (Irá trazer um único registro)
        - (GET) 'api/v1/enderecos?id=:id_do_endereco' 
    - Cadastrar novo endereço
        - (POST) 'api/v1/enderecos/salvar' 

        Exemplo de envio body:

        {
            endereco: "Rua Takão Massago",
            numero: 1144,
            complemento: "Casa",
            cep: "79822-355",
            cidade_id: 1,
            usuario_id: 1
        }
                
    - Alterar informações do endereço
        - (PUT) 'api/v1/enderecos/edit/:id_do_endereco' 

        {
            endereco: "Rua Takão Massago",
            numero: 1144,
            complemento: "Casa",
            cep: "79822-355",
            cidade_id: 1,
            usuario_id: 1
        }
                
    - Deletar endereço da base de dados
        - (DELETE) 'api/v1/enderecos/deletar/:id_do_endereco' 
      
