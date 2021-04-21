import express, { Application} from 'express';
import cors from 'cors';

//Importar rotas
import usuarioRoutes from './routes/usuarioRoute';
import enderecoRoutes from './routes/enderecoRoute';
import cidadeRoutes from './routes/cidadeRoute';
import estadoRoutes from './routes/estadoRoute';
import administradorRoutes from './routes/administradorRoute';
import authRoutes from './routes/authRoute';

// Importar Autenticação
import {validarAutenticacao} from './config/auth';

const app: Application = express();
const port:Number = 3000;


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

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`);
});