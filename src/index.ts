import express, { Request, Response } from 'express';
import { findByCPF } from './client/elasticsearch';

const app = express();
const port = 3333;

app.use(express.static('public'));
app.use(express.json());

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
});


app.get('/:cpf', async (req: Request, res: Response) => {
    const data_result = await findByCPF(req.params.cpf);
    return res.json(!!data_result ? data_result : {});
})

app.listen(port, async () => {
    console.log(`Servidor API rodando na porta ${port}`)
})
