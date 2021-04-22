import { app } from "../server";
import request from "supertest";

let cadastro = {
  nome: "Marcos",
  telefone: "(67) 99667 - 8725",
  email: "marcoslopesg7@gmail.com",
  idade: 22,
  peso: 64,
  etinia: "Pardo",
};

let loginAdministradorSend = {
  cpf: '000.000.000-10',
  senha: 'Marc9951'
};

describe(`/api/v1/usuarios - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app).get("/api/v1/usuarios");
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/usuarios/save - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app)
      .post("/api/v1/usuarios")
      .send(cadastro)
      .set('Accept', 'application/json');
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/usuarios/edit/1 - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app)
      .put("/api/v1/usuarios/edit/1")
      .send(cadastro)
      .set('Accept', 'application/json');
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/usuarios/deletar/1 - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app).delete("/api/v1/usuarios/deletar/1");
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/usuarios - Listando usuários`, () => {
  it("Fazendo login e listando usuários", async () => {

    let token = null;

    const loginAdmistrador = await request(app)
      .post("/api/v1/auth/entrar")
      .send(loginAdministradorSend)
      .set('Accept', 'application/json')
      .expect(function (res) {
        token = res.body.token;
      })

    expect(loginAdmistrador.status).toEqual(200);

    const result = await request(app)
      .get("/api/v1/usuarios")
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toEqual(200);

    const resultUsuarioID = await request(app)
      .get("/api/v1/usuarios?id=1111")
      .set('Authorization', `Bearer ${token}`);

    expect(resultUsuarioID.status).toEqual(417);
  });
});

describe(`Testando cadastro e edição do usuário.`, () => {
  it("Testando validação de campos vazios, email inválido, salvando e editando cadastro corretamente", async () => {

    let token = null;
    let usuarioID = null;

    const loginAdmistrador = await request(app)
      .post("/api/v1/auth/entrar")
      .send(loginAdministradorSend)
      .set('Accept', 'application/json')
      .expect(function (res) {
        token = res.body.token;
      })

    expect(loginAdmistrador.status).toEqual(200);

    /// Testando modulo de cadastro do usuário
    /// Novo cadastro
    const result = await request(app)
      .post("/api/v1/usuarios/salvar")
      .send(cadastro)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(function (res) {
        usuarioID = res.body.usuario.id;
      });

    expect(result.status).toEqual(200);

    /// Testando campos vazios
    const resultInputEmpty = await request(app)
      .post("/api/v1/usuarios/salvar")
      .send({})
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resultInputEmpty.body).toEqual({
      status: false,
      message: 'Preencha os campos corretamente!',
      validation: {
        nome: 'Campo é obrigatório',
        telefone: 'Campo é obrigatório',
        email: 'Email inválido',
        idade: 'Campo é obrigatório',
        peso: 'Campo é obrigatório',
        etinia: 'Campo é obrigatório'
      }
    });

    /// Testando email inválido
    cadastro['email'] = 'marcoslopesg7';

    const resultEmailInválido = await request(app)
      .post("/api/v1/usuarios/salvar")
      .send(cadastro)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resultEmailInválido.body).toEqual({
      status: false,
      message: 'Preencha os campos corretamente!',
      validation: { email: 'Email inválido' }
    });

    /// Testando modulo editação de usuário

    //Alterando o campo nome
    cadastro['nome'] = 'Testando edição';
    cadastro['email'] = 'testepr@gmail.com';

    const resultEdicaoCadastro = await request(app)
      .put(`/api/v1/usuarios/edit/${usuarioID}`)
      .send(cadastro)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)

    expect(resultEdicaoCadastro.status).toEqual(200);

    /// Testando campos vazios
    const resultEdicaoInputEmpty = await request(app)
      .put(`/api/v1/usuarios/edit/${usuarioID}`)
      .send({})
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resultEdicaoInputEmpty.body).toEqual({
      status: false,
      message: 'Preencha os campos corretamente!',
      validation: {
        nome: 'Campo é obrigatório',
        telefone: 'Campo é obrigatório',
        email: 'Email inválido',
        idade: 'Campo é obrigatório',
        peso: 'Campo é obrigatório',
        etinia: 'Campo é obrigatório'
      }
    });

    //Deletar usuário com id correto
    const resultEdicaoDelete = await request(app)
      .delete(`/api/v1/usuarios/deletar/${usuarioID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resultEdicaoDelete.status).toEqual(200);
  });
});
