import dotenv from 'dotenv';
import { User } from './schema/models.js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../.env' });

const usersToSeed = [
  { name: 'Maria Clara', email: 'maria.aluna@escola.com', password: await bcrypt.hash('senha123', 10) },
  { name: 'João Pedro', email: 'joao.aluno@escola.com', password: await bcrypt.hash('senha123', 10) },
  { name: 'Carlos Andrade', email: 'diretor@escola.com', password: await bcrypt.hash('senha123', 10) },
  { name: 'Beatriz Lima', email: 'coordenador@escola.com', password: await bcrypt.hash('senha123', 10) },
  { name: 'Ricardo Souza', email: 'professor@escola.com', password: await bcrypt.hash('senha123', 10) },
];

export async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('O banco de dados já está populado. O seed não será executado.');
      return;
    }

    console.log('Populando o banco de dados com usuários iniciais...');
    await User.insertMany(usersToSeed);
    console.log('Usuários foram inseridos com sucesso.');
  } catch (error) {
    console.error('Erro durante o processo de seed:', error);
  }
}