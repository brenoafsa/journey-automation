import userRepository from '../repositories/userRepository.js';
import { generateAccessToken } from '../services/tokenService.js';
import { userSchema, userUpdateSchema, loginSchema } from '../validation/userValidation.js';
import emailQueue from '../services/emailQueue.js';
import bcrypt from 'bcryptjs';

class UserController {
    async create(req, res, next) {
    try {
        const { error, value } = userSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const hashedPassword = await bcrypt.hash(value.password, 10);
            value.password = hashedPassword;

            const user = await userRepository.create(value);

            await emailQueue.add(
                {
                    to: user.email,
                    subject: 'Bem-vindo ao Journey!',
                    text: `Olá ${user.name}, seja bem-vindo ao Journey! Tente criar um evento e agendar uma tarefa para começar.`
                },
                { delay: 60000 }
            );

            const token = generateAccessToken({ id: user.id });
            res.status(201).json({ token });
        } catch (err) {
            next(err);
        }
    }

    async checkCredentials(req, res, next) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            const { email, password } = value;
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const token = generateAccessToken({ id: user.id });
            res.status(200).json({ token });
        } catch (err) {
            next(err);
        }
    }
    
    async readAll(req, res, next) {
        try {
            const users = await userRepository.findAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { error, value } = userUpdateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const updatedUser = await userRepository.update(id, value);
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            await userRepository.delete(id);
            res.status(200).json({ message: 'Usuário deletado com sucesso' });        
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();