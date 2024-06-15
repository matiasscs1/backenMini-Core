import mongoose from 'mongoose';
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Agregar ceros a la izquierda si es necesario
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const pacienteSchema = new mongoose.Schema({
    id_doctor: {
        type: String,
        required: true
    },
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true
    },
    edad: {
        type: String,
        required: true
    },
    contacto_emergencia: {
        type: String,
        required: true
    },
    motivo_consulta: {
        type: String,
        required: true
    },
    sintomas: {
        type: [String],
        required: false
    },
    alergias: {
        type: [String],
        required: false
    },
    diagnostico: {
        type: String
    },
    medicamentoAtomar: {
        type: [String]
    },
    porcentajeCoincidencia: {
        type: Number,
        default: 0
    },
    fecha: {
        type: Date,
        default: () => formatDate(new Date())
    }

});

export default mongoose.model('User', pacienteSchema);
