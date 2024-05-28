import Patologias from '../Model/patologias_personales.model.js';

// registrar las patologias personales

// registrar las patologias personales

export const postPatologia = async (req, res) => {
    try {
        // Verificar si ya existe una patología para este paciente
        const existingPatologia = await Patologias.findOne({ id_paciente: req.body.id_paciente });

        if (existingPatologia) {
            // Si ya existe, retornar un error
            return res.status(400).json({ message: "El paciente ya tiene registrada una patología" });
        }

        // Si no existe, guardar la nueva patología
        const patologia = {
            id_paciente: req.body.id_paciente,
            Vih: req.body.Vih,
            Diabetes: req.body.Diabetes,
            Hipertension: req.body.Hipertension,
            enfermedadCardiaca: Array.isArray(req.body.enfermedadCardiaca) ? req.body.enfermedadCardiaca : [req.body.enfermedadCardiaca],
            otrasEnfermedades: Array.isArray(req.body.otrasEnfermedades) ? req.body.otrasEnfermedades : [req.body.otrasEnfermedades],
            informacionAdicional: req.body.informacionAdicional
        };

        const newPatologia = new Patologias(patologia);
        await newPatologia.save();
        res.status(200).json({ message: "Patología registrada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// get de todas las patologias 

export const getPatologias = async (req, res) => {
    try {
        const patologias = await Patologias.find();
        res.status(200).json(patologias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get de las patologias por id de paciente

export const getPatologiasByIdPaciente = async (req, res) => {
    try {
        const patologias = await Patologias.find({ id_paciente: req.params.id });
        res.status(200).json(patologias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update de las patologias por id 

export const updatePatologiaById = async (req, res) => {
    try {
        await Patologias.findByIdAndUpdate
            (req.params.id, {
                Vih: req.body.Vih,
                Diabetes: req.body.Diabetes,
                Hipertension: req.body.Hipertension,
                enfermedadCardiaca: Array.isArray(req.body.enfermedadCardiaca) ? req.body.enfermedadCardiaca : [req.body.enfermedadCardiaca],
                otrasEnfermedades: Array.isArray(req.body.otrasEnfermedades) ? req.body.otrasEnfermedades : [req.body.otrasEnfermedades],
                informacionAdicional: req.body.informacionAdicional
            });
        res.status(200).json({ message: "Patología actualizada exitosamente" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

