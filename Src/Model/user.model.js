import mongoose from 'mongoose';

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
    cedula:{
        type: String,
        required:true
    },
    edad:{
         type:String,
         required:true
     },
     contacto_emergencia:{
         type:String,
         required:true
     },
     motivo_consulta:{
         type:String,
         required:true
     },
     sintomas:{
          type:[String], 
          required:false 
      }, 
      alergias:{ 
          type:[String], 
          required:false 
      }, 
      diagnostico:{ 
          type:String
        },  
       medicamentoAtomar:{  
           type:[String]
       }   
});

export default mongoose.model('User', pacienteSchema);
