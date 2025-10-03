const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const uri = process.env.MONGODB_URI;

const dbName = process.env.MONGODB_NAME;

async function conectarMongoDB() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Conectado ao MongoDB com sucesso!');

        const db = client.db(dbName);

        await db.createCollection('users');
        console.log("Coleção 'users' criada com sucesso!");

        const colecoes = await db.listCollections().toArray();
        console.log('Coleções:', colecoes);
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
    } finally {
        await client.close();
    }
}

conectarMongoDB();