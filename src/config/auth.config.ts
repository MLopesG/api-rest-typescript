import { NextFunction, Request, Response } from 'express';
import { QueryResult } from 'pg';
import jwt, { decode } from 'jsonwebtoken';
import { pool } from './database.config';
import { chave } from './secret.config';

export const validarAutenticacao = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token = req.headers['authorization'];
    let expiration: object = { expiresIn: '1h' };

    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        await jwt.verify(token, chave.secret, expiration, async (err: any, decoded: any) => {

            if (decoded && decoded.data) {
                /// Verificar administrador
                const verifyCadastro: QueryResult = await pool.query(`select * from administrador where cpf ='${decoded.data.cpf}'`);

                if (verifyCadastro && verifyCadastro.rows.length <= 0) {
                    return await res.status(417).json({
                        status: false,
                        message: 'Desculpe! Você não tem autorização para acessar essa REST API!'
                    });
                }

                if (err) {
                    return res.status(417).json({
                        status: false,
                        message: 'Você não possui autorização para consumir api, token inválido.'
                    });
                }
                return await next();
            }

            return res.status(417).json({
                status: false,
                message: 'Você não possui autorização para consumir api, token inválido.'
            });
        });
    } else {
        return await res.status(417).json({
            status: false,
            message: 'Você não possui autorização para consumir api.'
        });
    }
};