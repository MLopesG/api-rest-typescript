"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var router = express_1.Router();
var administradorController_1 = require("../controllers/administradorController");
router.get('/', administradorController_1.getAdministradores);
router.post('/salvar', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('cpf', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('senha', 'Campo é obrigatório').not().isEmpty()
], administradorController_1.salvarAdministrador);
router.put('/edit/:id', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('cpf', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('senha', 'Campo é obrigatório').not().isEmpty()
], administradorController_1.editAdministrador);
router.delete('/deletar/:id', administradorController_1.deletarAdministrador);
exports.default = router;
