import { app } from "../server";
import request from "supertest";

let estado = {
    nome: 'Mato Grosso Do Sul',
    uf: 'MS'
};

let cidade = {
    nome: 'Dourados',
    estado_id: null
};

let login = {
    cpf: '000.000.000-10',
    senha: 'Marc9951'
};

describe(`/api/v1/cidades - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app).get("/api/v1/cidades");
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/cidades/save - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app)
            .post("/api/v1/cidades")
            .send(estado)
            .set('Accept', 'application/json');
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/cidades/edit/1 - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app)
            .put("/api/v1/cidades/edit/1")
            .send(estado)
            .set('Accept', 'application/json');
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/cidades/deletar/1 - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app).delete("/api/v1/cidades/deletar/1");
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/cidades - Listando cidades cadastradas`, () => {
    it("Fazendo login e listando cidades do sistema", async () => {

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
            .get("/api/v1/cidades")
            .set('Authorization', `Bearer ${token}`);

        if (result.status === 417) expect(result.status).toEqual(417);
        else expect(result.status).toEqual(200);

        const resultCidade = await request(app)
            .get("/api/v1/cidades?id=112")
            .set('Authorization', `Bearer ${token}`);

        expect(resultCidade.status).toEqual(417);
    });
});

describe(`Testando cadastro e edição de uma cidade.`, () => {
    it("Testando validação de campos vazios, salvando e editando cadastro corretamente", async () => {

        let token = null;
        let cidadeID = null;

        const loginAdmistrador = await request(app)
            .post("/api/v1/auth/entrar")
            .send(login)
            .set('Accept', 'application/json')
            .expect(function (res) {
                token = res.body.token;
            })

        expect(loginAdmistrador.status).toEqual(200);

        /// Testando modulo de cadastro de uma cidade
        /// Novo cadastro
        const result = await request(app)
            .post("/api/v1/estados/salvar")
            .send(estado)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(function (res) {
                cidade['estado_id'] = res.body.estado.id;
            });

        expect(result.status).toEqual(200);

        /// Cadastrar nova cidade
        const resultCidadeSave = await request(app)
            .post("/api/v1/cidades/salvar")
            .send(cidade)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(function (res) {
                cidadeID = res.body.cidade.id;
            });

        expect(resultCidadeSave.status).toEqual(200);
        /// Buscar cadastro de um cidade
        const resultCidade = await request(app)
            .get(`/api/v1/cidades?id=${cidadeID}&enderecos=true`)
            .set('Authorization', `Bearer ${token}`);

        expect(resultCidade.status).toEqual(200);
        
        /// Testando campos vazios
        const resultInputEmpty = await request(app)
            .post("/api/v1/cidades/salvar")
            .send({})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(resultInputEmpty.body).toEqual({
            status: false,
            message: "Preencha os campos corretamente!",
            validation: {
                nome: "Campo é obrigatório",
                estado_id: "Campo é obrigatório"
            }
        });
        /// Testando modulo editação de cidade
        //Alterando o campo nome
        cidade['nome'] = 'Grande Dourados';

        const resultEdicao = await request(app)
            .put(`/api/v1/cidades/edit/${cidadeID}`)
            .send(cidade)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)

        expect(resultEdicao.status).toEqual(200);

        /// Testando campos vazios
        const resultEdicaoInputEmpty = await request(app)
            .put(`/api/v1/cidades/edit/${cidadeID}`)
            .send({})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(resultEdicaoInputEmpty.body).toEqual({
            status: false,
            message: "Preencha os campos corretamente!",
            validation: {
                nome: "Campo é obrigatório",
                estado_id: "Campo é obrigatório"
            }
        });
        //Deletar usuário com id correto
        const resultEdicaoDelete = await request(app)
            .delete(`/api/v1/cidades/deletar/${cidadeID}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resultEdicaoDelete.status).toEqual(200);
    });
});