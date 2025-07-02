import mongose from 'mongoose';

const doctorSchema = new  mongose.Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    especialidad:{
        type: String,
        required: true
    },
    telefono:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    direccion_Consultorio:{
        type: String,
        required: true
    },
    ciudad:{
        type: String,
        required: true
    },
    nacimiento:{
        type: Date,
        required: true
    },
    genero:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    Número_de_matriculaMedica:{
        type: String,
        required: true,
        unique: true
        
    },
    Fecha_de_Registro:{
        type: Date,
        default: Date.now
    }
    
});
export default mongose.model('Doctor', doctorSchema);
