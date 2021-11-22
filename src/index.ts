import {app} from "./server";

const porta:Number = process.env.PORT || 3001;

app.listen(porta, () => console.log(`Servidor rodando na porta: ${porta}.`));
