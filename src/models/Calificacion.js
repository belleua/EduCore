const mongoose = require('mongoose');

const calificacionSchema = new mongoose.Schema({
  estudiante: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
  docente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  curso: { type: String, required: true, trim: true },
  asignatura: { type: String, required: true, trim: true },
  periodo: { type: String, required: true, trim: true },
  calificacion: { type: Number, required: true, min: 0, max: 100 },
}, { timestamps: { createdAt: 'creadoEn' } });

module.exports = mongoose.model('Calificacion', calificacionSchema);
