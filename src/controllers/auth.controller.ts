import { Request, Response } from 'express';
import { pool } from '../config/database.config';
import { errorsFormat } from '../config/format.config';
import {Administrador} from  '../models/administrador.model';
import {validationResult} from 'express-validator';
import { QueryResult } from 'pg';
import jwt from 'jsonwebtoken';
import {chave} from '../config/secret.config';

export const logarAdministrador = async (req: Request, res: Response) => {
    const administradorBody: Administrador = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    const veriftCadastro : QueryResult = await pool.query(`select id, nome, cpf from administrador where cpf ='${administradorBody.cpf}' and senha = md5('${administradorBody.senha}')`);
 
    if(veriftCadastro.rows.length === 0){
        return res.status(417).json({
            status: false,
            message: 'Não foi possivel autenticar usuário!'
        });
    }
    /// Gerar token de autenticação 
    const token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), data: veriftCadastro.rows[0]}, chave.secret);

    return res.status(200).json({
        status: true,
        token: token,
        administrador: veriftCadastro.rows[0]
    });
};
