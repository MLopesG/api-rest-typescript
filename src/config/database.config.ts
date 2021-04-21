import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'root',
    database: 'teste_pr',
    port: 5432
});