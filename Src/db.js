import mongoose from 'mongoose';

 async function  connectDB (){
    console.log('Connecting to MongoDB');
    try{
        await mongoose.connect('mongodb://localhost/medicaApp');
        console.log('MongoDB Connected');
    }catch(err){
        console.log(err);
    }



};


function lol(){
    console.log('lol');
}
export {connectDB, lol}

