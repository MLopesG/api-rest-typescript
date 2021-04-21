"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletarAdministrador = exports.editAdministrador = exports.salvarAdministrador = exports.getAdministradores = void 0;
var database_1 = require("../config/database");
var format_1 = require("../config/format");
var express_validator_1 = require("express-validator");
var getAdministradores = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response_1, response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!(req && req.query.id)) return [3 /*break*/, 2];
                return [4 /*yield*/, database_1.pool.query("SELECT * FROM administrador  where id = " + req.query.id)];
            case 1:
                response_1 = _a.sent();
                if (response_1.rows.length === 0) {
                    return [2 /*return*/, res.status(200).json({
                            status: false,
                            message: "Desculpe, Administrador não foi encontrado!"
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        administrador: response_1.rows[0]
                    })];
            case 2: return [4 /*yield*/, database_1.pool.query('SELECT * FROM administrador order by nome asc')];
            case 3:
                response = _a.sent();
                if (response.rows.length === 0) {
                    return [2 /*return*/, res.status(200).json({
                            status: false,
                            message: "Desculpe, No momento não temos nenhum administrador cadastrado em nossa base de dados!"
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        administradores: response.rows
                    })];
            case 4:
                e_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAdministradores = getAdministradores;
var salvarAdministrador = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var administradorBody, errors, veriftCadastro, save;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                administradorBody = req.body;
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: 'Preencha os campos corretamente!',
                            validation: format_1.errorsFormat(errors.array())
                        })];
                }
                return [4 /*yield*/, database_1.pool.query("select * from administrador where cpf ='" + administradorBody.cpf + "'")];
            case 1:
                veriftCadastro = _a.sent();
                if (veriftCadastro.rows.length > 0) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: 'CPF já está sendo utilizado, informe outro CPF!'
                        })];
                }
                return [4 /*yield*/, database_1.pool.query('INSERT INTO administrador (nome, cpf, senha) VALUES ($1, $2, md5($3))', Object.values(administradorBody))];
            case 2:
                save = _a.sent();
                if (save) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Administrador cadastrado com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel realizar novo cadastro!'
                    })];
        }
    });
}); };
exports.salvarAdministrador = salvarAdministrador;
var editAdministrador = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var administradorBody, errors, saveEdit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                administradorBody = req.body;
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: 'Preencha os campos corretamente!',
                            validation: format_1.errorsFormat(errors.array())
                        })];
                }
                return [4 /*yield*/, database_1.pool.query("update administrador set nome = $1, cpf = $2, senha = md5($3) WHERE id = " + req.params.id, Object.values(administradorBody))];
            case 1:
                saveEdit = _a.sent();
                if (saveEdit) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Administrador alterado com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel alterar cadastro!'
                    })];
        }
    });
}); };
exports.editAdministrador = editAdministrador;
var deletarAdministrador = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admDeletar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.pool.query("DELETE FROM administrador where id = " + req.params.id + ";")];
            case 1:
                admDeletar = _a.sent();
                if (admDeletar) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Administrador deletado com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel excluir cadastro!'
                    })];
        }
    });
}); };
exports.deletarAdministrador = deletarAdministrador;
