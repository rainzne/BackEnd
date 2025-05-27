let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    // Nouvelles propriétés requises
    auteur: String,
    matiere: {
        nom: String,
        image: String,
        professeur: {
            nom: String,
            photo: String
        }
    },
    note: {
        type: Number,
        min: 0,
        max: 20,
        default: null
    },
    remarques: String
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
