import {app} from "./server";

const porta:Number = 3000;

app.listen(porta, () => console.log(`Servidor rodando na porta: ${porta}.`));