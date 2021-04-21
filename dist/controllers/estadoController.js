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
exports.deletarEstado = exports.editEstado = exports.salvarEstado = exports.getEstado = void 0;
var database_1 = require("../config/database");
var format_1 = require("../config/format");
var express_validator_1 = require("express-validator");
var getEstado = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var responseEstado, responseCidades, response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!(req && req.query.id)) return [3 /*break*/, 3];
                return [4 /*yield*/, database_1.pool.query("SELECT * FROM estado where id = " + req.query.id)];
            case 1:
                responseEstado = _a.sent();
                if (responseEstado.rows.length === 0) {
                    return [2 /*return*/, res.status(200).json({
                            status: false,
                            message: "Desculpe, estado não encontrado!"
                        })];
                }
                return [4 /*yield*/, database_1.pool.query("SELECT id, nome FROM cidade where estado_id = " + req.query.id + " order by nome asc")];
            case 2:
                responseCidades = _a.sent();
                // Vincular cidades ao estado
                responseEstado.rows[0]['cidades'] = responseCidades.rows;
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        estado: responseEstado.rows[0]
                    })];
            case 3: return [4 /*yield*/, database_1.pool.query("SELECT * FROM estado order by nome asc")];
            case 4:
                response = _a.sent();
                if (response.rows.length === 0) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: "Desculpe, nenhuma cidade está vinculada a esse estado!"
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        status: true,
                        estados: response.rows
                    })];
            case 5:
                e_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        status: false,
                        message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getEstado = getEstado;
var salvarEstado = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var estadoBody, errors, save;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                estadoBody = req.body;
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: 'Preencha os campos corretamente!',
                            validation: format_1.errorsFormat(errors.array())
                        })];
                }
                return [4 /*yield*/, database_1.pool.query('INSERT INTO estado (nome, uf) VALUES ($1, $2)', Object.values(estadoBody))];
            case 1:
                save = _a.sent();
                if (save) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Estado cadastro com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel realizar novo cadastro!'
                    })];
        }
    });
}); };
exports.salvarEstado = salvarEstado;
var editEstado = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var estadoBody, errors, saveEdit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                estadoBody = req.body;
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(417).json({
                            status: false,
                            message: 'Preencha os campos corretamente!',
                            validation: format_1.errorsFormat(errors.array())
                        })];
                }
                return [4 /*yield*/, database_1.pool.query("update estado set nome = $1, uf = $2 WHERE id = " + req.params.id, Object.values(estadoBody))];
            case 1:
                saveEdit = _a.sent();
                if (saveEdit) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Estado alterado com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel realizar alterar cadastro!'
                    })];
        }
    });
}); };
exports.editEstado = editEstado;
var deletarEstado = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var estadoDeletar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.pool.query("DELETE FROM estado where id = " + req.params.id + "; DELETE FROM cidade where estado_id = " + req.params.id)];
            case 1:
                estadoDeletar = _a.sent();
                if (estadoDeletar) {
                    return [2 /*return*/, res.status(200).json({
                            status: true,
                            message: 'Estado deletado com sucesso!'
                        })];
                }
                return [2 /*return*/, res.status(417).json({
                        status: false,
                        message: 'Não foi possivel excluir estado!'
                    })];
        }
    });
}); };
exports.deletarEstado = deletarEstado;
