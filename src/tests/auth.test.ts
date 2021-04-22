import { app } from "../server";
import request from "supertest";

let loginAdministradorSend = {
  cpf: '000.000.000-10',
  senha: 'Marc9951'
};

let loginAdministradorSendInvalido = {
  cpf: '000.000.000-10',
  senha: 'Marc991www51'
};

describe(`/api/v1/auth/entrar - testando autenticação login`, () => {
  it("Efetuando login na api", async () => {
    const result = await request(app)
      .post("/api/v1/auth/entrar")
      .send(loginAdministradorSend)
      .set('Accept', 'application/json');

    expect(result.status).toEqual(200);
  });

  it("Efetuando login na api, validando campos vazios", async () => {
    const result = await request(app)
      .post("/api/v1/auth/entrar")
      .send({})
      .set('Accept', 'application/json');

    expect(result.status).toEqual(417);
  });

  it("Efetuando login na api, com cadastro inválido", async () => {
    const result = await request(app)
      .post("/api/v1/auth/entrar")
      .send(loginAdministradorSendInvalido)
      .set('Accept', 'application/json');

    expect(result.status).toEqual(417);
  });
});
