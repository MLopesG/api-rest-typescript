"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
//Importar rotas
var usuarioRoute_1 = __importDefault(require("./routes/usuarioRoute"));
var enderecoRoute_1 = __importDefault(require("./routes/enderecoRoute"));
var cidadeRoute_1 = __importDefault(require("./routes/cidadeRoute"));
var estadoRoute_1 = __importDefault(require("./routes/estadoRoute"));
var administradorRoute_1 = __importDefault(require("./routes/administradorRoute"));
var authRoute_1 = __importDefault(require("./routes/authRoute"));
// Importar Autenticação
var auth_1 = require("./config/auth");
var app = express_1.default();
var port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// liberando cors para comunicação externa.
app.use(cors_1.default());
// carregamento de rotas
// Rotas privadas
app.use('/api/v1/usuarios', auth_1.validarAutenticacao, usuarioRoute_1.default);
app.use('/api/v1/enderecos', auth_1.validarAutenticacao, enderecoRoute_1.default);
app.use('/api/v1/cidades', auth_1.validarAutenticacao, cidadeRoute_1.default);
app.use('/api/v1/estados', auth_1.validarAutenticacao, estadoRoute_1.default);
app.use('/api/v1/administradores', auth_1.validarAutenticacao, administradorRoute_1.default);
//Rotas públicas
app.use('/api/v1/auth', authRoute_1.default);
app.listen(port, function () {
    console.log("Servidor rodando na porta: " + port);
});
