"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var router = express_1.Router();
var estadoController_1 = require("../controllers/estadoController");
router.get('/', estadoController_1.getEstado);
router.post('/salvar', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('uf', 'Campo é obrigatório').not().isEmpty()
], estadoController_1.salvarEstado);
router.put('/edit/:id', [
    express_validator_1.check('nome', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('uf', 'Campo é obrigatório').not().isEmpty()
], estadoController_1.editEstado);
router.delete('/deletar/:id', estadoController_1.deletarEstado);
exports.default = router;
