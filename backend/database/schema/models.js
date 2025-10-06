import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+@.+/, unique: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const invitationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['invited', 'accepted', 'declined'], default: 'invited' },
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  sendInvitesAt: { type: Date, required: true},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteMessage: { type: String, required: true },
  participants: [invitationSchema]
});

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  assignAt: { type: Date, required: true }
});

export const User = mongoose.model('User', userSchema);
export const Event = mongoose.model('Event', eventSchema);
export const Task = mongoose.model('Task', taskSchema);