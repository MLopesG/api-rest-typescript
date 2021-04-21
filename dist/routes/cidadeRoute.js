"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var router = express_1.Router();
var cidadeController_1 = require("../controllers/cidadeController");
router.get('/', cidadeController_1.getCidades);
router.post('/salvar', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('estado_id', 'Campo é obrigatório').not().isEmpty()
], cidadeController_1.salvarCidade);
router.put('/edit/:id', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('estado_id', 'Campo é obrigatório').not().isEmpty()
], cidadeController_1.editCidade);
router.delete('/deletar/:id', cidadeController_1.deletarCidade);
exports.default = router;
