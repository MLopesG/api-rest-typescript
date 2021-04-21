import { Request, Response } from 'express';
import { pool } from '../config/database';
import { errorsFormat } from '../config/format';
import {Endereco} from  '../models/enderecoModel';
import {validationResult} from 'express-validator';
import { QueryResult } from 'pg';

export const getEnderecos = async (req: Request, res: Response): Promise<Response> => {
    try {

        if(req && req.query.id){
            const responseEndereco : QueryResult = await pool.query(`SELECT * from endereco where id = ${req.query.id}`);

            if(responseEndereco.rows.length === 0){
                return res.status(200).json({
                    status: false,
                    message: "Desculpe, Endereço não encontrado!"
                });
            }

            return res.status(200).json({
                status: true,
                endereco: responseEndereco.rows
            });
        }

        const response: QueryResult = await pool.query(`SELECT * FROM endereco order by endereco asc`);

        if(response.rows.length === 0){
            return res.status(417).json({
                status: false,
                message: "Desculpe, nenhum endereço encontrado!"
            });
        }

        return res.status(200).json({
            status: true,
            enderecos: response.rows
        });
    } catch (e) {
        return res.status(500).json({
            status:false,
            message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
        });
    }
};

export const salvarEndereco = async (req: Request, res: Response) => {
    const enderecoBody: Endereco = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    const save : QueryResult = await pool.query('INSERT INTO endereco (endereco,numero,complemento,cep,cidade_id,usuario_id) VALUES ($1, $2, $3, $4, $5, $6)', Object.values(enderecoBody));

    if(save){
        return res.status(200).json({
            status: true,
            message: 'Endereço cadastrado com sucesso!'
        })
    }

    return res.status(417).json({
        status: false,
        message: 'Não foi possivel realizar novo cadastro!'
    });
};

export const editEndereco = async (req: Request, res: Response) => {
    const enderecoBody: Endereco = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }
    
    const saveEdit : QueryResult = await pool.query(`UPDATE endereco set endereco = $1,numero  = $2,complemento  = $3,cep  = $4,cidade_id  = $5,usuario_id  = $6 where id = ${req.params.id}`, Object.values(enderecoBody));

    if(saveEdit){
        return res.status(200).json({
            status: true,
            message: 'Endereço alterado com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel alterar cadastro!'
    });
};

export const deletarEndereco = async (req: Request, res: Response) => {
    const enderecoDeletar : QueryResult = await pool.query(`DELETE FROM endereco where id = ${req.params.id};`);

    if(enderecoDeletar){
        return res.status(200).json({
            status: true,
            message: 'Endereço removido com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel excluir endereço!'
    });
};