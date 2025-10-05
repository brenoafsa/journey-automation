import { Event } from '../../database/schema/models.js';

class EventRepository {
    async create(data) {
        const event = await Event.create(data);
        return event;
    }
    
    async findAll() {
        const event = await Event.find();
        return event;
    }

    async findById(id) {
        const event = await Event.findById(id);
        return event;
    }

    async findParticipant(eventId, userId) {
        const event = await this.findById(eventId);
        if (!event) return null;
        
        return event.participants.find(p => p.user.toString() === userId);
    }

    async update(id, data) {
        const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });
        return updatedEvent;
    }

    async updateStatus(eventId, userId, status) {
        const result = await Event.updateOne(
            { _id: eventId, 'participants.user': userId },
            { $set: { 'participants.$.status': status } }
        );
        return result;
    }

    async delete(id) {
        const deletedEvent = await Event.findByIdAndDelete(id);
        return deletedEvent;
    }
}

export default new EventRepository();