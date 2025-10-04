const { MongoClient } = require('mongodb');

let db;

async function conectarMongoDB() {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        console.log('Conectado ao MongoDB com sucesso!');
        db = client.db(process.env.MONGODB_NAME);
        return db;
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
}

module.exports = conectarMongoDB;