import { app } from "../server";
import request from "supertest";

let administrador = {
  cpf: '000.000.000-11',
  senha: 'Marc9951',
  nome: "Marcos Lopes 2"
};

let login = {
  cpf: '000.000.000-10',
  senha: 'Marc9951'
};

describe(`/api/v1/administradores - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app).get("/api/v1/usuarios");
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/administradores/save - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app)
      .post("/api/v1/usuarios")
      .send(administrador)
      .set('Accept', 'application/json');
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/administradores/edit/1 - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app)
      .put("/api/v1/usuarios/edit/1")
      .send(administrador)
      .set('Accept', 'application/json');
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/administradores/deletar/1 - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app).delete("/api/v1/usuarios/deletar/1");
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/usuarios - Listando administradores cadastrados`, () => {
  it("Fazendo login e listando administradores do sistema", async () => {

    let token = null;

    const loginAdmistrador = await request(app)
      .post("/api/v1/auth/entrar")
      .send(login)
      .set('Accept', 'application/json')
      .expect(function (res) {
        token = res.body.token;
      })

    expect(loginAdmistrador.status).toEqual(200);

    const result = await request(app)
      .get("/api/v1/administradores")
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);

    const resultBuscanoUsuarioInvalido = await request(app)
      .get("/api/v1/administradores?id=19")
      .set('Authorization', `Bearer ${token}`);

    expect(resultBuscanoUsuarioInvalido.status).toEqual(417);

  });
});

describe(`Testando cadastro de novo administrador e edição do usuário.`, () => {
  it("Testando validação de campos vazios, salvando e editando cadastro corretamente", async () => {

    let token = null;
    let admID = null;

    const loginAdmistrador = await request(app)
      .post("/api/v1/auth/entrar")
      .send(login)
      .set('Accept', 'application/json')
      .expect(function (res) {
        token = res.body.token;
      })

    expect(loginAdmistrador.status).toEqual(200);

    /// Testando modulo de cadastro 
    /// Novo cadastro
    const result = await request(app)
      .post("/api/v1/administradores/salvar")
      .send(administrador)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(function (res) {
        admID = res.body.administrador.id;
      });
      
    expect(result.status).toEqual(200);
    /// Testando campos vazios
    const resultInputEmpty = await request(app)
      .post("/api/v1/administradores/salvar")
      .send({})
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resultInputEmpty.body).toEqual({
      status: false,
      message: "Preencha os campos corretamente!",
      validation: {
        nome: "Campo é obrigatório",
        cpf: "Campo é obrigatório",
        senha: "Campo é obrigatório"
      }
    });
    /// Testando modulo editação do adm
    //Alterando o campo nome
    administrador['nome'] = 'ADM master';
    const resultEdicaoCadastro = await request(app)
      .put(`/api/v1/administradores/edit/${admID}`)
      .send(administrador)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)

    expect(resultEdicaoCadastro.status).toEqual(200);
    /// Testando campos vazios
    const resultEdicaoInputEmpty = await request(app)
      .put(`/api/v1/administradores/edit/${admID}`)
      .send({})
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resultEdicaoInputEmpty.body).toEqual({
      status: false,
      message: "Preencha os campos corretamente!",
      validation: {
        nome: "Campo é obrigatório",
        cpf: "Campo é obrigatório",
        senha: "Campo é obrigatório"
      }
    });
    //Deletar adm com id correto
    const resultEdicaoDelete = await request(app)
      .delete(`/api/v1/administradores/deletar/${admID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resultEdicaoDelete.status).toEqual(200);
  });
});
