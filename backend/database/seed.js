import dotenv from 'dotenv';
import { User } from './schema/models.js';

dotenv.config({ path: '../.env' });

const usersToSeed = [
  { name: 'Maria Clara', email: 'maria.aluna@escola.com' },
  { name: 'João Pedro', email: 'joao.aluno@escola.com' },
  { name: 'Carlos Andrade', email: 'diretor@escola.com' },
  { name: 'Beatriz Lima', email: 'coordenador@escola.com' },
  { name: 'Ricardo Souza', email: 'professor@escola.com' },
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