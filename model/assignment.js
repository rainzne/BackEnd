const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  dateDeRendu: {
    type: String,
    required: true
  },
  rendu: {
    type: Boolean,
    default: false
  },
  auteur: {
    type: String,
    required: true
  },
  note: {
    type: Number,
    min: 0,
    max: 20,
    default: null
  },
  matiere: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  prof: {
    type: String,
    required: true
  },
  photo_prof: {
    type: String
  },
  remarque: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);