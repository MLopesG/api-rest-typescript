import { Request, Response } from 'express';
import { pool } from '../config/database';
import { errorsFormat } from '../config/format';
import {Usuario} from  '../models/usuarioModel';
import {validationResult} from 'express-validator';
import { QueryResult } from 'pg';

export const getUsuarios = async (req: Request, res: Response): Promise<Response> => {
    try {
        if(req && req.query.id){
            const response: QueryResult = await pool.query(`SELECT * FROM usuario  where id = ${req.query.id}`);

            if(response.rows.length === 0){
                return res.status(200).json({
                    status: false,
                    message: "Desculpe, usuário não foi encontrado!"
                });
            }
            /// Buscar endereço vinculado há esse usuário selecionado
            const filterEnderecos: QueryResult = await pool.query(`    
                select e.id, e.endereco, e.numero, e.complemento, e.cep, 
                c.nome as nome_cidade, es.nome as nome_estado, es.uf
                from endereco e
                inner join cidade c on c.id = e.cidade_id
                inner join estado es on es.id = c.estado_id 
                where e.usuario_id = ${req.query.id}
            `);
            /// Atribribuir endereços ao usuário selecionado
            response.rows[0]['enderecos'] = filterEnderecos.rows;

            return res.status(200).json({
                status: true,
                usuarios: response.rows
            });
        }

        const response: QueryResult = await pool.query('SELECT * FROM usuario order by nome asc');

        if(response.rows.length === 0){
            return res.status(200).json({
                status: false,
                message: "Desculpe, No momento não temos nenhum usuário cadastrado em nossa base de dados!"
            });
        }
        return res.status(200).json({
            status: true,
            usuarios: response.rows
        });
    } catch (e) {
        return res.status(500).json({
            status:false,
            message: 'Desculpe, ocorreu um erro interno em nosso servidor!'
        });
    }
};

export const salvarUsuario = async (req: Request, res: Response) => {
    const usuarioBody: Usuario = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    const save : QueryResult = await pool.query('INSERT INTO usuario (nome, telefone, email, idade, peso, etinia) VALUES ($1, $2, $3, $4, $5, $6)', Object.values(usuarioBody));

    if(save){
        return res.status(200).json({
            status: true,
            message: 'Usuário cadastro com sucesso!'
        })
    }

    return res.status(417).json({
        status: false,
        message: 'Não foi possivel realizar novo cadastro!'
    });
};

export const editUsuario = async (req: Request, res: Response) => {
    const usuarioBody: Usuario = req.body;
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(417).json({
            status: false,
            message: 'Preencha os campos corretamente!',
            validation: errorsFormat(errors.array())
        });
    }

    const saveEdit : QueryResult = await pool.query(`update usuario set nome = $1, telefone = $2, email = $3, idade = $4, peso = $5, etinia = $6 WHERE id = ${req.params.id}`, Object.values(usuarioBody));

    if(saveEdit){
        return res.status(200).json({
            status: true,
            message: 'Usuário alterado com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel  alterar cadastro!'
    });
};

export const deletarUsuario = async (req: Request, res: Response) => {
    const usuarioDeletar : QueryResult = await pool.query(`DELETE FROM usuario where id = ${req.params.id}; DELETE FROM endereco where usuario_id = ${req.params.id}`);

    if(usuarioDeletar){
        return res.status(200).json({
            status: true,
            message: 'Usuário deletado com sucesso!'
        })
    }
    
    return res.status(417).json({
        status: false,
        message: 'Não foi possivel excluir cadastro!'
    });
};