import { Request, Response } from 'express';
import { pool } from '../config/database';
import { errorsFormat } from '../config/format';
import {Estado} from  '../models/estadoModel';
import {validationResult} from 'express-validator';
import { QueryResult } from 'pg';

export const getEstado = async (req: Request, res: Response): Promise<Response> => {
    try {

        if(req && req.query.id){
            const responseEstado : QueryResult = await pool.query(`SELECT * FROM estado where id = ${req.query.id}`);

            if(responseEstado.rows.length === 0){
                return res.status(200).json({
                    status: false,
                    message: "Desculpe, estado não encontrado!"
                });
            }

            const responseCidades: QueryResult = await pool.query(`SELECT id, nome FROM cidade where estado_id = ${req.query.id} order by nome asc`);

            // Vincular cidades ao estado
            responseEstado.rows[0]['cidades'] = responseCidades.rows;

            return res.status(200).json({
                status: true,
                estado: responseEstado.rows[0]
            });
        }

        const response: QueryResult = await pool.query(`SELECT * FROM estado order by nome asc`);

        if(response.rows.length === 0){
            return res.status(417).json({
                status: false,
                message: "Desculpe, nenhuma cidade está vinculada a esse estado!"
            });
        }

        return res.status(200).json({
            status: true,
            estados: response.rows
        });
    } catch (e) {
        return res.status(500).json({
            status:false,
            message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
        });
    }
};

export const salvarEstado = async (req: Request, res: Response) => {
    const estadoBody: Estado = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    const save : QueryResult = await pool.query('INSERT INTO estado (nome, uf) VALUES ($1, $2)', Object.values(estadoBody));

    if(save){
        return res.status(200).json({
            status: true,
            message: 'Estado cadastro com sucesso!'
        })
    }

    return res.status(417).json({
        status: false,
        message: 'Não foi possivel realizar novo cadastro!'
    });
};

export const editEstado = async (req: Request, res: Response) => {
    const estadoBody: Estado = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }
    
    const saveEdit : QueryResult = await pool.query(`update estado set nome = $1, uf = $2 WHERE id = ${req.params.id}`, Object.values(estadoBody));

    if(saveEdit){
        return res.status(200).json({
            status: true,
            message: 'Estado alterado com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel realizar alterar cadastro!'
    });
};

export const deletarEstado = async (req: Request, res: Response) => {
    const estadoDeletar : QueryResult = await pool.query(`DELETE FROM estado where id = ${req.params.id}; DELETE FROM cidade where estado_id = ${req.params.id}`);

    if(estadoDeletar){
        return res.status(200).json({
            status: true,
            message: 'Estado deletado com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel excluir estado!'
    });
};