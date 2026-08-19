const mongoose = require('mongoose');

const escuelaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  codigo: { type: String, required: true, unique: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  contacto: { type: String, required: true, trim: true },
  activa: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'creadoEn' } });

module.exports = mongoose.model('Escuela', escuelaSchema);