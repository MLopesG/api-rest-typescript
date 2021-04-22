import { Request, Response } from 'express';
import { pool } from '../config/database.config';
import { errorsFormat } from '../config/format.config';
import {Cidade} from  '../models/cidade.model';
import {validationResult} from 'express-validator';
import { QueryResult } from 'pg';

export const getCidades = async (req: Request, res: Response): Promise<Response> => {
    try {
        if(req && req.query.id){
            const responseCidade : QueryResult = await pool.query(`SELECT id, nome FROM cidade where id = ${req.query.id}`);

            if(responseCidade.rows.length === 0){
                return res.status(417).json({
                    status: false,
                    message: "Desculpe, cidade não encontrado!"
                });
            }

            const filterEstado: QueryResult = await pool.query(`    
                select e.* from estado e
                inner join cidade c on c.estado_id  = e.id
                where c.id = ${req.query.id}
                order by e.nome asc
            `);

            //Vincular estado pertencente a cidade
            responseCidade.rows[0]['estado'] = filterEstado.rows[0];

            // Buscar todos os endereços, vinculado à essa cidade
            if(req.query.enderecos){
                const filterEnderecoCidades: QueryResult = await pool.query(`    
                    select e.id, e.endereco, e.numero, e.complemento, e.cep,
                    e.usuario_id, u.nome
                    from endereco e
                    inner join usuario u on u.id = e.usuario_id
                    where   e.cidade_id = ${req.query.id}      
                `);
                responseCidade.rows[0]['enderecos'] = filterEnderecoCidades.rows;
            }

            return res.status(200).json({
                status: true,
                cidade: responseCidade.rows
            });
        }

        const response: QueryResult = await pool.query(`SELECT id, nome FROM cidade order by nome asc`);

        if(response.rows.length === 0){
            return res.status(417).json({
                status: false,
                message: "Desculpe, nenhuma cidade encontrada!"
            });
        }

        return res.status(200).json({
            status: true,
            cidades: response.rows
        });
    } catch (e) {
        return res.status(500).json({
            status:false,
            message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
        });
    }
};

export const salvarCidade = async (req: Request, res: Response) => {
    const cidadeBody: Cidade = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    const save : QueryResult = await pool.query('INSERT INTO cidade (nome, estado_id) VALUES ($1, $2)  returning*', Object.values(cidadeBody));

    if(save){
        return res.status(200).json({
            status: true,
            message: 'Cidade foi cadastrada com sucesso!',
            cidade: save.rows[0]
        })
    }

    return res.status(417).json({
        status: false,
        message: 'Não foi possivel realizar novo cadastro!'
    });
};

export const editCidade = async (req: Request, res: Response) => {
    const cidadeBody: Cidade = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }
    
    const saveEdit : QueryResult = await pool.query(`update cidade set nome = $1, estado_id = $2 WHERE id = ${req.params.id} returning*`, Object.values(cidadeBody));

    if(saveEdit){
        return res.status(200).json({
            status: true,
            message: 'Cidade alterado com sucesso!',
            cidade: saveEdit.rows[0]
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel  alterar cadastro!'
    });
};

export const deletarCidade = async (req: Request, res: Response) => {
    const cidadeDeletar : QueryResult = await pool.query(`DELETE FROM cidade where id = ${req.params.id};`);

    if(cidadeDeletar){
        return res.status(200).json({
            status: true,
            message: 'Cidade deletada com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel excluir cidade!'
    });
};