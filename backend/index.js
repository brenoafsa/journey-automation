const express = require('express')
const app = express()
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Aplicação foi iniciada!');
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
});