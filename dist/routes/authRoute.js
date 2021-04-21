"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var router = express_1.Router();
var authController_1 = require("../controllers/authController");
router.post('/entrar', [
    express_validator_1.check('cpf', 'Campo é obrigatório').not().isEmpty(),
    express_validator_1.check('senha', 'Campo é obrigatório').not().isEmpty(),
], authController_1.logarAdministrador);
exports.default = router;
