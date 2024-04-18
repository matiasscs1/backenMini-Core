import mongose from 'mongoose';

const userSchema = new  mongose.Schema({
   username:{
         type: String,
         required: true
    },
    email:{
        type: String,
        required: true
    },
    nacimiento:{
         type: Date,
         required: true,

    },
    genero:{
        type: String,
        required: true,
    },
    telefono:{
        type: String,
        required: true,
    },
    nombre:{
        type: String,
        required: true,
    },
    direccion:{
        type: String,
        required: true,

    },
    ciudad:{
        type: String,
        required: true,
    },
});

export default mongose.model('User', userSchema);