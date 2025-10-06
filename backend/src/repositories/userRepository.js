import { User } from '../../database/schema/models.js';

class UserRepository {
    async create(data) {
        const user = await User.create(data);
        return user;
    }
    
    async findAll() {
        const users = await User.find().populate('tasks');
        return users;
    }

    async findById(id) {
        const user = await User.findById(id).populate('tasks');
        return user;
    }

    async update(id, data) {
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
        return updatedUser;
    }

    async delete(id) {
        const deletedUser = await User.findByIdAndDelete(id);
        return deletedUser;
    }
}

export default new UserRepository();