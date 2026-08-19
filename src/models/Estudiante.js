const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true, trim: true },
  documentoIdentidad: { type: String, required: true, trim: true },
  fechaNacimiento: { type: Date, required: true },
  grado: { type: String, required: true, trim: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  escuela: { type: mongoose.Schema.Types.ObjectId, ref: 'Escuela', required: true },
  registradoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
}, { timestamps: { createdAt: 'creadoEn' } });

estudianteSchema.index({ documentoIdentidad: 1, escuela: 1 }, { unique: true });

module.exports = mongoose.model('Estudiante', estudianteSchema);