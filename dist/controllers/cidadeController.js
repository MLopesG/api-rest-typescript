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
exports.deletarCidade = exports.editCidade = exports.salvarCidade = exports.getCidades = void 0;
var database_1 = require("../config/database");
var format_1 = require("../config/format");
var express_validator_1 = require("express-validator");
var getCidades = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var responseCidade, filterEstado, filterEnderecoCidades, response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                if (!(req && req.query.id)) return [3 /*break*/, 5];
                return [4 /*yield*/, database_1.pool.query("SELECT id, nome FROM cidade where id = " + req.query.id)];
            case 1:
                responseCidade = _a.sent();
                if (responseCidade.rows.length === 0) {
                    return [2 /*return*/, res.status(200).json({
                            status: false,
                            message: "Desculpe, cidade não encontrado!"
                        })];
                }
                return [4 /*yield*/, database_1.pool.query("    \n                select e.* from estado e\n                inner join cidade c on c.estado_id  = e.id\n                where c.id = " + req.query.id + "\n                order by e.nome asc\n            ")];
            case 2:
                filterEstado = _a.sent();
                //Vincular estado pertencente a cidade
                responseCidade.rows[0]['estado'] = filterEstado.rows[0];
                if (!req.query.enderecos) return [3 /*break*/, 4];
                return [4 /*yield*/, database_1.pool.query("    \n                    select e.id, e.endereco, e.numero, e.complemento, e.cep,\n                    e.usuario_id, u.nome\n                    from endereco e\n                    inner join usuario u on u.id = e.usuario_id\n                    where   e.cidade_id = " + req.query.id + "      \n                ")];
            case 3:
                filterEnderecoCidades = _a.sent();
                responseCidade.rows[0]['enderecos'] = filterEnderecoCidades.rows;
                _a.label = 4;
            case 4: return [2 /*return*/, res.status(200).json({
                    status: true,
                    cidade: responseCidade.rows
                })];
            case 5: return [4 /*yield*/, database_1.pool.query("SELECT id, nome FROM cidade order by nome asc")];
            case 6:
                response = _a.sent();
                if (response.rows.length === 0) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: "Desculpe, nenhuma cidade encontrada!"
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        cidades: response.rows
                    })];
            case 7:
                e_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
                    })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getCidades = getCidades;
var salvarCidade = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cidadeBody, errors, save;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cidadeBody = req.body;
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: 'Preencha os campos corretamente!',
                            validation: format_1.errorsFormat(errors.array())
                        })];
                }
                return [4 /*yield*/, database_1.pool.query('INSERT INTO cidade (nome, estado_id) VALUES ($1, $2)', Object.values(cidadeBody))];
            case 1:
                save = _a.sent();
                if (save) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Cidade foi cadastrada com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel realizar novo cadastro!'
                    })];
        }
    });
}); };
exports.salvarCidade = salvarCidade;
var editCidade = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cidadeBody, errors, saveEdit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cidadeBody = req.body;
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: 'Preencha os campos corretamente!',
                            validation: format_1.errorsFormat(errors.array())
                        })];
                }
                return [4 /*yield*/, database_1.pool.query("update cidade set nome = $1, estado_id = $2 WHERE id = " + req.params.id, Object.values(cidadeBody))];
            case 1:
                saveEdit = _a.sent();
                if (saveEdit) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Cidade alterado com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel  alterar cadastro!'
                    })];
        }
    });
}); };
exports.editCidade = editCidade;
var deletarCidade = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cidadeDeletar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.pool.query("DELETE FROM cidade where id = " + req.params.id + ";")];
            case 1:
                cidadeDeletar = _a.sent();
                if (cidadeDeletar) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Cidade deletada com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel excluir cidade!'
                    })];
        }
    });
}); };
exports.deletarCidade = deletarCidade;
