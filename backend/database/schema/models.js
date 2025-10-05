import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+@.+/, unique: true }
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

export const User = mongoose.model('User', userSchema);
export const Event = mongoose.model('Event', eventSchema);