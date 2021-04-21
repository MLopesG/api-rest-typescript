"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var router = express_1.Router();
var enderecoController_1 = require("../controllers/enderecoController");
router.get('/', enderecoController_1.getEnderecos);
router.post('/salvar', [
    express_validator_1.check('endereco', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('numero', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('complemento', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('cep', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('cidade_id', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('usuario_id', 'Campo é obrigatório').not().isEmpty()
], enderecoController_1.salvarEndereco);
router.put('/edit/:id', [
    express_validator_1.check('endereco', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('numero', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('complemento', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('cep', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('cidade_id', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('usuario_id', 'Campo é obrigatório').not().isEmpty()
], enderecoController_1.editEndereco);
router.delete('/deletar/:id', enderecoController_1.deletarEndereco);
exports.default = router;
