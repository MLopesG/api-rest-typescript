import {Router} from 'express';
import { check } from 'express-validator';

const router = Router();

import { getAdministradores, salvarAdministrador, editAdministrador, deletarAdministrador } from '../controllers/administradorController';

router.get('/', getAdministradores);

router.post('/salvar',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('cpf', 'Campo é obrigatório').not().isEmpty(),
        check('senha', 'Campo é obrigatório').not().isEmpty()
    ], salvarAdministrador
);

router.put('/edit/:id',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('cpf', 'Campo é obrigatório').not().isEmpty(),
        check('senha', 'Campo é obrigatório').not().isEmpty()
    ], editAdministrador
);

router.delete('/deletar/:id',deletarAdministrador);

export default router;