import { Request, Response } from 'express';
import { pool } from '../config/database';
import { errorsFormat } from '../config/format';
import {Administrador} from  '../models/administradorModel';
import {validationResult} from 'express-validator';
import { QueryResult } from 'pg';

export const getAdministradores = async (req: Request, res: Response): Promise<Response> => {
    try {
        if(req && req.query.id){
            const response: QueryResult = await pool.query(`SELECT * FROM administrador  where id = ${req.query.id}`);

            if(response.rows.length === 0){
                return res.status(200).json({
                    status: false,
                    message: "Desculpe, Administrador não foi encontrado!"
                });
            }
         
            return res.status(200).json({
                status: true,
                administrador: response.rows[0]
            });
        }

        const response: QueryResult = await pool.query('SELECT * FROM administrador order by nome asc');

        if(response.rows.length === 0){
            return res.status(200).json({
                status: false,
                message: "Desculpe, No momento não temos nenhum administrador cadastrado em nossa base de dados!"
            });
        }
        return res.status(200).json({
            status: true,
            administradores: response.rows
        });
    } catch (e) {
        return res.status(500).json({
            status:false,
            message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
        });
    }
};

export const salvarAdministrador = async (req: Request, res: Response) => {
    const administradorBody: Administrador = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    /// Verificar CPF se já possui cadastro
    const veriftCadastro : QueryResult = await pool.query(`select * from administrador where cpf ='${administradorBody.cpf}'`);

    if(veriftCadastro.rows.length > 0){
        return res.status(417).json({
            status: false,
            message: 'CPF já está sendo utilizado, informe outro CPF!'
        });
    }

    const save : QueryResult = await pool.query('INSERT INTO administrador (nome, cpf, senha) VALUES ($1, $2, md5($3))', Object.values(administradorBody));

    if(save){
        return res.status(200).json({
            status: true,
            message: 'Administrador cadastrado com sucesso!'
        })
    }

    return res.status(417).json({
        status: false,
        message: 'Não foi possivel realizar novo cadastro!'
    });
};

export const editAdministrador= async (req: Request, res: Response) => {
    const administradorBody: Administrador = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    const saveEdit : QueryResult = await pool.query(`update administrador set nome = $1, cpf = $2, senha = md5($3) WHERE id = ${req.params.id}`, Object.values(administradorBody));

    if(saveEdit){
        return res.status(200).json({
            status: true,
            message: 'Administrador alterado com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel alterar cadastro!'
    });
};

export const deletarAdministrador = async (req: Request, res: Response) => {
    const admDeletar : QueryResult = await pool.query(`DELETE FROM administrador where id = ${req.params.id};`);

    if(admDeletar){
        return res.status(200).json({
            status: true,
            message: 'Administrador deletado com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel excluir cadastro!'
    });
};