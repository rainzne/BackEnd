let Assignment = require('../model/assignment');
let mongoose = require('mongoose');

// Récupérer TOUS les assignments avec pagination (GET /api/assignments)
function getAssignments(req, res){
    // Récupérer les paramètres de pagination depuis la query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`Récupération des assignments - Page: ${page}, Limit: ${limit}`);

    // Récupérer tous les assignments avec pagination
    Assignment.find({})
        .skip(skip)
        .limit(limit)
        .sort({dateDeRendu: -1}) // Trier par date de rendu (optionnel)
        .exec((err, assignments) => {
            if(err){
                console.log('Erreur lors de la recherche:', err);
                return res.status(500).send({message: 'Erreur serveur', error: err});
            }

            // Compter le total pour la pagination
            Assignment.countDocuments({}, (err, totalDocs) => {
                if(err){
                    console.log('Erreur count:', err);
                    return res.status(500).send({message: 'Erreur serveur', error: err});
                }

                res.json({
                    docs: assignments,
                    totalDocs: totalDocs,
                    limit: limit,
                    page: page,
                    totalPages: Math.ceil(totalDocs / limit),
                    hasNextPage: page < Math.ceil(totalDocs / limit),
                    hasPrevPage: page > 1
                });
            });
        });
}

// Récupérer UN assignment par son id (GET /api/assignments/:id)
function getAssignment(req, res){
    let assignmentId = req.params.id;
    console.log("Recherche assignment avec ID:", assignmentId);

    // Vérifiez si l'ID est un ObjectId MongoDB valide
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        return res.status(400).send({message: 'ID invalide'});
    }

    Assignment.findById(assignmentId, (err, assignment) => {
        if(err){
            console.log('Erreur lors de la recherche:', err);
            return res.status(500).send(err);
        }
        if(!assignment) {
            return res.status(404).send({message: 'Assignment non trouvé'});
        }
        res.json(assignment);
    });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment);

    assignment.save((err) => {
        if(err){
            console.log('Erreur save:', err);
            return res.status(400).send('cant post assignment ' + err);
        }
        res.json({ message: `${assignment.nom} saved!`});
    });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log('Erreur update:', err);
            return res.status(500).send(err);
        }
        if (!assignment) {
            return res.status(404).send({message: 'Assignment non trouvé'});
        }
        res.json({message: 'updated', assignment: assignment});
    });
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    let assignmentId = req.params.id;
    
    Assignment.findByIdAndRemove(assignmentId, (err, assignment) => {
        if (err) {
            console.log('Erreur delete:', err);
            return res.status(500).send(err);
        }
        if (!assignment) {
            return res.status(404).send({message: 'Assignment non trouvé'});
        }
        res.json({message: `${assignment.nom} deleted`});
    });
}

module.exports = { getAssignments, getAssignment, postAssignment, updateAssignment, deleteAssignment };
