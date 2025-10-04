import Usuario from '../../database/models/userSchema.js';

class UserRepository {
    async create(data) {
        const user = await Usuario.create(data);
        return user;
    }
    
    async findAll() {
        const users = await Usuario.find();
        return users;
    }

    async findById(id) {
        const user = await Usuario.findById(id);
        return user;
    }

    async update(id, data) {
        const updatedUser = await Usuario.findByIdAndUpdate(id, data, { new: true });
        return updatedUser;
    }

    async delete(id) {
        const deletedUser = await Usuario.findByIdAndDelete(id);
        return deletedUser;
    }
}

export default new UserRepository();