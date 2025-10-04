import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+@.+/ }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;