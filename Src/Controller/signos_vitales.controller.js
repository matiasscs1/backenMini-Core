
import signos_vitalesModel from "../Model/signos_vitales.model.js";

// registrar los signos vitales

export const postSignosVitales = async (req, res) => {
    try {
        const signoVital_Unico = signos_vitalesModel.findOne({ id : req.params.id });
        if (signoVital_Unico) {
            return res.status(400).json({ message: "El paciente ya tiene registrados los signos vitales" });
        }
        const signos_vitales = {
            id_paciente: req.body.id_paciente,
            temperatura: req.body.temperatura,
            pulso: req.body.pulso,
            presionArterial: req.body.presionArterial,
            peso: req.body.peso,
            estatura: req.body.estatura
        };

        const newSignosVitales = new signos_vitalesModel(signos_vitales);
        await newSignosVitales.save();
        res.status(200).json({ message: "Signos vitales registrados exitosamente" });


        res.status(200).json({ message: "Signos vitales registrados exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update signos vitales

export async function updateSignosVitales(req, res) {
    try {
        const signos_vitales = {
            id_paciente: req.body.id_paciente,
            temperatura: req.body.temperatura,
            pulso: req.body.pulso,
            presionArterial: req.body.presionArterial,
            peso: req.body.peso,
            estatura: req.body.estatura
        };

        await signos_vitalesModel.findByIdAndUpdate(req.params.id, signos_vitales);
        res.status(200).json({ message: "Signos vitales actualizados exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get de signos vitales por id_paciente

export async function getSignosVitalesId(req, res) {
    try {
        const signos_vitales = await signos_vitalesModel.find({ id_paciente: req.params.id });
        res.status(200).json(signos_vitales);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
