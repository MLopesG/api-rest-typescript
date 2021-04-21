import {Router} from 'express';
import { check } from 'express-validator';

const router = Router();

import { getEstado, salvarEstado, editEstado, deletarEstado } from '../controllers/estado.controller';

router.get('/', getEstado);

router.post('/salvar',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('uf', 'Campo é obrigatório').not().isEmpty()
    ], salvarEstado
);

router.put('/edit/:id',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('uf', 'Campo é obrigatório').not().isEmpty()
    ], editEstado
);

router.delete('/deletar/:id', deletarEstado);

export default router;