import userRepository from '../repositories/userRepository.js';
import { userSchema, userUpdateSchema } from '../validation/index.js';

class UserController {
    async create(req, res, next) {
        try {
            const { error, value } = userSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const user = await userRepository.create(value);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }
    
    async readAllUsers(req, res, next) {
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