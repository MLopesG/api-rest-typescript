import {Router} from 'express';
import { check } from 'express-validator';

const router = Router();

import { getUsuarios, salvarUsuario, editUsuario, deletarUsuario } from '../controllers/usuario.controller';

router.get('/', getUsuarios);

router.post('/salvar',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('telefone', 'Campo é obrigatório').not().isEmpty(),
        check('email', 'Campo é obrigatório').not().isEmpty(),
        check('email', 'Email inválido').isEmail(),
        check('idade', 'Campo é obrigatório').not().isEmpty(),
        check('peso', 'Campo é obrigatório').not().isEmpty(),
        check('etinia', 'Campo é obrigatório').not().isEmpty()
    ], salvarUsuario
);
router.put('/edit/:id',
    [
        check('nome', 'Campo é obrigatório').not().isEmpty(),
        check('telefone', 'Campo é obrigatório').not().isEmpty(),
        check('email', 'Campo é obrigatório').not().isEmpty(),
        check('email', 'Email inválido').isEmail(),
        check('idade', 'Campo é obrigatório').not().isEmpty(),
        check('peso', 'Campo é obrigatório').not().isEmpty(),
        check('etinia', 'Campo é obrigatório').not().isEmpty()
    ], editUsuario
);

router.delete('/deletar/:id',deletarUsuario);

export default router;