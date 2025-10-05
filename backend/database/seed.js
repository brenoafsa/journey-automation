import dotenv from 'dotenv';
import Usuario from './models/userSchema.js';

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
    const userCount = await Usuario.countDocuments();
    if (userCount > 0) {
      console.log('O banco de dados já está populado. O seed não será executado.');
      return;
    }

    console.log('Populando o banco de dados com usuários iniciais...');
    await Usuario.insertMany(usersToSeed);
    console.log('Usuários foram inseridos com sucesso.');
  } catch (error) {
    console.error('Erro durante o processo de seed:', error);
  }
}