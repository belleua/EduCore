const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
  estudiante: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante' },
  solicitadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  escuela: { type: mongoose.Schema.Types.ObjectId, ref: 'Escuela', required: true },
  grado: { type: String, required: true, trim: true },
  periodo: { type: String, required: true, trim: true },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aprobada', 'Rechazada'],
    default: 'Pendiente',
  },
  motivoRechazo: { type: String, trim: true },
  revisadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  revisadoEn: { type: Date },
}, { timestamps: { createdAt: 'creadoEn' } });

module.exports = mongoose.model('Inscripcion', inscripcionSchema);