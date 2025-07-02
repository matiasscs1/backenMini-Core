import mongoose from "mongoose"; 


const signos_vitalesSchema = new mongoose.Schema({
    id_paciente: {
        type: String,
        required: true
    },
    temperatura: {
        type: String,
        required: true
    },
    pulso: {
        type: String,
        required: true
    },
    presionArterial: {
        type: String,
        required: true
    },
    peso: {
        type: String,
        required: true
    },
    estatura: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("signos_vitales", signos_vitalesSchema);