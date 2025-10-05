import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import conectarMongoDB from './database/mongoClient.js';
import routes from './src/routes/index.js';
import { seedDatabase } from './database/seed.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
    res.send('Aplicação foi iniciada e conectada ao MongoDB!');
});

async function startServer() {
    try {
        await conectarMongoDB();
        await seedDatabase();

        app.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Falha ao iniciar o servidor:", error);
        process.exit(1);
    }
}

startServer();