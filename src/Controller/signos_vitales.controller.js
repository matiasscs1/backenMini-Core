
import signos_vitalesModel from "../Model/signos_vitales.model.js";
import { getPacientes } from "./user.controller.js";
// registrar los signos vitales
export const postSignosVitales = async (req, res) => {
    try {
        const signos_vitales = {
            id_paciente: req.body.id_paciente,
            temperatura: req.body.temperatura || '',
            pulso: req.body.pulso || '',
            presionArterial: req.body.presionArterial || '',
            peso: req.body.peso || '',
            estatura: req.body.estatura || ''
        };

        const newSignosVitales = new signos_vitalesModel(signos_vitales);
        await newSignosVitales.save();
        res.status(200).json({ message: "Signos vitales registrados exitosamente" });
    } catch (error) {
        console.error('Error al registrar los signos vitales:', error); // Más detalles del error
        res.status(500).json({ message: error.message });
    }
}


// actualizar los signos vitales segun el id_paciente y que no sea obligatorio editar todo 

export const updateSignosVitales = async (req, res) => {
    try {
        // Filtrar solo los campos presentes en el cuerpo de la solicitud
        const signos_vitales = {};
        if (req.body.temperatura !== undefined) signos_vitales.temperatura = req.body.temperatura;
        if (req.body.pulso !== undefined) signos_vitales.pulso = req.body.pulso;
        if (req.body.presionArterial !== undefined) signos_vitales.presionArterial = req.body.presionArterial;
        if (req.body.peso !== undefined) signos_vitales.peso = req.body.peso;
        if (req.body.estatura !== undefined) signos_vitales.estatura = req.body.estatura;

        // Actualizar el documento
        const updatedSignosVitales = await signos_vitalesModel.findOneAndUpdate(
            { id_paciente: req.params.id },
            { $set: signos_vitales },
            { new: true, runValidators: true }
        );

        if (updatedSignosVitales) {
            res.status(200).json({ message: "Signos vitales actualizados exitosamente" });
        } else {
            res.status(404).json({ message: "Paciente no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// diagnostico
export async function getSignosVitalesIdDiagnostico(req) {
    try {
        const signos_vitales = await signos_vitalesModel.findOne({ id_paciente: req.params.id });
        return signos_vitales;
    } catch (error) {
        throw new Error(error.message);
    }
}
/// front 
export async function getSignosVitalesId(req, res) {
    try {
        const signos_vitales = await signos_vitalesModel.findOne({ id_paciente: req.params.id });
        res.status(200).json(signos_vitales);
    } catch (error) {
        throw new Error(error.message);
    }
}

// get signos vitales

export async function getSignosVitales(req, res) {
    try {
        const signos_vitales = await signos_vitalesModel.find();
        res.status(200).json(signos_vitales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
