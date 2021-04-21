import {Router} from 'express';
import { check } from 'express-validator';

const router = Router();

import {  logarAdministrador } from '../controllers/auth.controller';

router.post('/entrar',
    [
        check('cpf', 'Campo é obrigatório').not().isEmpty(),
        check('senha', 'Campo é obrigatório').not().isEmpty(),
    ], logarAdministrador
);

export default router;