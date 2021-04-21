import {Router} from 'express';
import { check } from 'express-validator';

const router = Router();

import { getEnderecos, salvarEndereco, editEndereco, deletarEndereco} from '../controllers/enderecoController';

router.get('/', getEnderecos);

router.post('/salvar',
    [
        check('endereco', 'Campo é obrigatório').not().isEmpty(),
        check('numero', 'Campo é obrigatório').not().isEmpty(),
        check('complemento', 'Campo é obrigatório').not().isEmpty(),
        check('cep', 'Campo é obrigatório').not().isEmpty(),
        check('cidade_id', 'Campo é obrigatório').not().isEmpty(),
        check('usuario_id', 'Campo é obrigatório').not().isEmpty()
    ], salvarEndereco
);
router.put('/edit/:id',
    [
        check('endereco', 'Campo é obrigatório').not().isEmpty(),
        check('numero', 'Campo é obrigatório').not().isEmpty(),
        check('complemento', 'Campo é obrigatório').not().isEmpty(),
        check('cep', 'Campo é obrigatório').not().isEmpty(),
        check('cidade_id', 'Campo é obrigatório').not().isEmpty(),
        check('usuario_id', 'Campo é obrigatório').not().isEmpty()
    ], editEndereco
);

router.delete('/deletar/:id', deletarEndereco);

export default router;