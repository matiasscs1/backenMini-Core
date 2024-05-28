import mongoose from 'mongoose';  
const patologias_personalesSchema = new mongoose.Schema({
    id_paciente: {
        type: String,
        required: true
    },
    Vih: {
        type: Boolean,
        required: true
    },
    Diabetes: {
        type: Boolean,
        required: true
    },
    Hipertension: {
        type: Boolean,
        required: true
    },
    enfermedadCardiaca: {
        type: [String],
        required: true
    },
    otrasEnfermedades: {
        type: [String],
        required: true
    },
    informacionAdicional: {  
        type: String,
        required: true
    }
});

export default mongoose.model('PatologiasPersonales', patologias_personalesSchema);
