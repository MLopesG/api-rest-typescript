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