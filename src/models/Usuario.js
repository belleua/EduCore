const mongoose = require('mongoose');

const asignacionSchema = new mongoose.Schema({
  grado: { type: String, required: true, trim: true },
  asignatura: { type: String, required: true, trim: true },
});

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  correo: { type: String, required: true, unique: true, trim: true, lowercase: true },
  contrasenaHash: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    enum: ['administrador', 'docente', 'padre', 'estudiante'],
  },
  escuela: { type: mongoose.Schema.Types.ObjectId, ref: 'Escuela' },
  activo: { type: Boolean, default: true },
  asignaciones: { type: [asignacionSchema], default: [] },
}, { timestamps: { createdAt: 'creadoEn' } });

module.exports = mongoose.model('Usuario', usuarioSchema);