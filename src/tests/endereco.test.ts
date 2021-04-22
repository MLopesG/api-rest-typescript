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

let estado = {
    nome: 'Mato Grosso Do Sul',
    uf: 'MS'
};

let cidade = {
    nome: 'Dourados',
    estado_id: null
};

let endereco = {
    endereco: "Rua Takão Massago",
    numero: 1144,
    complemento: "Casa",
    cep: "79822-355",
    cidade_id: null,
    usuario_id: null
}

let login = {
    cpf: '000.000.000-10',
    senha: 'Marc9951'
};

describe(`/api/v1/enderecos - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app).get("/api/v1/enderecos");
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/enderecos/save - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app)
            .post("/api/v1/enderecos")
            .send(estado)
            .set('Accept', 'application/json');
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/enderecos/edit/1 - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app)
            .put("/api/v1/enderecos/edit/1")
            .send(estado)
            .set('Accept', 'application/json');
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/enderecos/deletar/1 - testando autenticação JWT`, () => {
    it("Tentando acessar rota sem informar o token", async () => {
        const result = await request(app).delete("/api/v1/enderecos/deletar/1");
        expect(result.status).toEqual(401);
    });
});

describe(`/api/v1/enderecos - Listando todos endereços cadastrados`, () => {
    it("Fazendo login e Listando todos endereços", async () => {

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
            .get("/api/v1/enderecos")
            .set('Authorization', `Bearer ${token}`);

        if (result.status === 417) expect(result.status).toEqual(417);
        else expect(result.status).toEqual(200);

        const resultEnderecos = await request(app)
            .get("/api/v1/enderecos?id=112")
            .set('Authorization', `Bearer ${token}`);

        expect(resultEnderecos.status).toEqual(417);
    });
});


describe(`Testando cadastro de endereços nos usuários.`, () => {
    it("Testando validação de campos vazios, salvando e editando cadastro corretamente", async () => {

        let token = null;
        let enderecoID = null;

        const loginAdmistrador = await request(app)
            .post("/api/v1/auth/entrar")
            .send(login)
            .set('Accept', 'application/json')
            .expect(function (res) {
                token = res.body.token;
            })

        expect(loginAdmistrador.status).toEqual(200);

        /// Testando modulo de cadastro de uma cidade
        /// Cadastrar estado
        const result = await request(app)
            .post("/api/v1/estados/salvar")
            .send(estado)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(function (res) {
                cidade['estado_id'] = res.body.estado.id;
            });

        expect(result.status).toEqual(200);
        /// Cadastrar cidade
        const resultCidadeSave = await request(app)
            .post("/api/v1/cidades/salvar")
            .send(cidade)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(function (res) {
                endereco['cidade_id'] = res.body.cidade.id;
            });

        expect(resultCidadeSave.status).toEqual(200);

        /// Novo cadastro usuário
        const resultCadastroUsuario = await request(app)
            .post("/api/v1/usuarios/salvar")
            .send(cadastro)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(function (res) {
                endereco['usuario_id'] = res.body.usuario.id;
            });

        expect(resultCadastroUsuario.status).toEqual(200);

        /// Cadastrar endereço
        const resultEnderecoCadastro = await request(app)
            .post("/api/v1/enderecos/salvar")
            .send(endereco)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(function (res) {
                enderecoID = res.body.endereco.id;
            });

        expect(resultEnderecoCadastro.status).toEqual(200);

        /// Cadastrar endereço, campos vazios
        const resultEnderecoEmptyCadastro = await request(app)
            .post("/api/v1/enderecos/salvar")
            .send({})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(resultEnderecoEmptyCadastro.body).toEqual({
            status: false,
            message: "Preencha os campos corretamente!",
            validation: {
                endereco: "Campo é obrigatório",
                numero: "Campo é obrigatório",
                complemento: "Campo é obrigatório",
                cep: "Campo é obrigatório",
                cidade_id: "Campo é obrigatório",
                usuario_id: "Campo é obrigatório"
            }
        });
        /// Alteração do endereço, testando validação de campos vazios
        const resultEnderecoEditCadastroInputEmpty = await request(app)
            .post(`/api/v1/enderecos/edit/${enderecoID}`)
            .send({})
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(resultEnderecoEmptyCadastro.body).toEqual({
            status: false,
            message: "Preencha os campos corretamente!",
            validation: {
                endereco: "Campo é obrigatório",
                numero: "Campo é obrigatório",
                complemento: "Campo é obrigatório",
                cep: "Campo é obrigatório",
                cidade_id: "Campo é obrigatório",
                usuario_id: "Campo é obrigatório"
            }
        });
        /// Salvar alteração no endereço
        endereco['cep'] = '79811-050';
        endereco['endereco'] = 'R. Profa. Antônia Cândido de Melo';
        endereco['numero'] = 920;
        endereco['complemento'] = 'Casa 2';

        const resultEnderecoEdit = await request(app)
            .put(`/api/v1/enderecos/edit/${enderecoID}`)
            .send(endereco)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);

        expect(resultEnderecoEdit.status).toEqual(200);
        //Deletar endereco com id correto
        const resultEdicaoDelete = await request(app)
            .delete(`/api/v1/enderecos/deletar/${enderecoID}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resultEdicaoDelete.status).toEqual(200);
    });
});