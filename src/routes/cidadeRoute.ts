import {Router} from 'express';
import { check } from 'express-validator';

const router = Router();

import { getCidades, salvarCidade, editCidade, deletarCidade } from '../controllers/cidadeController';

router.get('/', getCidades);

router.post('/salvar',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('estado_id', 'Campo é obrigatório').not().isEmpty()
    ], salvarCidade
);
router.put('/edit/:id',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('estado_id', 'Campo é obrigatório').not().isEmpty()
    ], editCidade
);

router.delete('/deletar/:id',deletarCidade);

export default router;