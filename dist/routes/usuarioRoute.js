"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var router = express_1.Router();
var usuarioController_1 = require("../controllers/usuarioController");
router.get('/', usuarioController_1.getUsuarios);
router.post('/salvar', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('telefone', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('email', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('email', 'Email inválido').isEmail(),
    express_validator_1.check('idade', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('peso', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('etinia', 'Campo é obrigatório').not().isEmpty()
], usuarioController_1.salvarUsuario);
router.put('/edit/:id', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('telefone', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('email', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('email', 'Email inválido').isEmail(),
    express_validator_1.check('idade', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('peso', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('etinia', 'Campo é obrigatório').not().isEmpty()
], usuarioController_1.editUsuario);
router.delete('/deletar/:id', usuarioController_1.deletarUsuario);
exports.default = router;
