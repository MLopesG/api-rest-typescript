import express, { Application} from 'express';
import cors from 'cors';

//Importar rotas
import usuarioRoutes from './routes/usuario.route';
import enderecoRoutes from './routes/endereco.route';
import cidadeRoutes from './routes/cidade.route';
import estadoRoutes from './routes/estado.route';
import administradorRoutes from './routes/administrador.route';
import authRoutes from './routes/auth.route';

// Importar Autenticação
import {validarAutenticacao} from './config/auth.config';

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// liberando cors para comunicação externa.
app.use(cors());

// carregamento de rotas
// Rotas privadas
app.use('/api/v1/usuarios',validarAutenticacao,usuarioRoutes);
app.use('/api/v1/enderecos', validarAutenticacao, enderecoRoutes);
app.use('/api/v1/cidades', validarAutenticacao, cidadeRoutes);
app.use('/api/v1/estados', validarAutenticacao, estadoRoutes);
app.use('/api/v1/administradores', validarAutenticacao, administradorRoutes);
//Rotas públicas
app.use('/api/v1/auth', authRoutes);
