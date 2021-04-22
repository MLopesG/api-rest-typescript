import { app } from "../server";
import request from "supertest";

let estado = {
  nome: 'Mato Grosso Do Sul',
  uf: 'MS'
};

let login = {
  cpf: '000.000.000-10',
  senha: 'Marc9951'
};

describe(`/api/v1/estados - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app).get("/api/v1/estados");
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/estados/save - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app)
      .post("/api/v1/estados")
      .send(estado)
      .set('Accept', 'application/json');
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/estados/edit/1 - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app)
      .put("/api/v1/estados/edit/1")
      .send(estado)
      .set('Accept', 'application/json');
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/estados/deletar/1 - testando autenticação JWT`, () => {
  it("Tentando acessar rota sem informar o token", async () => {
    const result = await request(app).delete("/api/v1/estados/deletar/1");
    expect(result.status).toEqual(401);
  });
});

describe(`/api/v1/estados - Listando estados cadastrados`, () => {
  it("Fazendo login e listando estados do sistema", async () => {

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
      .get("/api/v1/estados")
      .set('Authorization', `Bearer ${token}`);

    if (result.status === 417) expect(result.status).toEqual(417);
    else expect(result.status).toEqual(200);

    const resultEstado = await request(app)
      .get("/api/v1/estados?id=112")
      .set('Authorization', `Bearer ${token}`);

    if (resultEstado.status === 417) expect(resultEstado.status).toEqual(417);
    else expect(resultEstado.status).toEqual(200);
  });
});

describe(`Testando cadastro e edição de um estado.`, () => {
  it("Testando validação de campos vazios, salvando e editando cadastro corretamente", async () => {

    let token = null;
    let estadoID = null;

    const loginAdmistrador = await request(app)
      .post("/api/v1/auth/entrar")
      .send(login)
      .set('Accept', 'application/json')
      .expect(function (res) {
        token = res.body.token;
      })

    expect(loginAdmistrador.status).toEqual(200);

    /// Testando modulo de cadastro do estado
    /// Novo cadastro
    const result = await request(app)
      .post("/api/v1/estados/salvar")
      .send(estado)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(function (res) {
        estadoID = res.body.estado.id;
      });

    expect(result.status).toEqual(200);

    /// Testando campos vazios
    const resultInputEmpty = await request(app)
      .post("/api/v1/estados/salvar")
      .send({})
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resultInputEmpty.body).toEqual({
      status: false,
      message: "Preencha os campos corretamente!",
      validation: {
        nome: "Campo é obrigatório",
        uf: "Campo é obrigatório"
      }
    });
    /// Testando modulo editação de um estado
    //Alterando o campo nome
    estado['nome'] = 'Mato Grosso do Sul';

    const resultEdicaoCadastro = await request(app)
      .put(`/api/v1/estados/edit/${estadoID}`)
      .send(estado)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)

    expect(resultEdicaoCadastro.status).toEqual(200);

    /// Testando campos vazios
    const resultEdicaoInputEmpty = await request(app)
      .put(`/api/v1/estados/edit/${estadoID}`)
      .send({})
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(resultEdicaoInputEmpty.body).toEqual({
      status: false,
      message: "Preencha os campos corretamente!",
      validation: {
        nome: "Campo é obrigatório",
        uf: "Campo é obrigatório"
      }
    });
    //Deletar estado com id correto
    const resultEdicaoDelete = await request(app)
      .delete(`/api/v1/estados/deletar/${estadoID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resultEdicaoDelete.status).toEqual(200);
  });
});