import mongoose from 'mongoose';

 async function  connectDB (){
    console.log('Connecting to MongoDB');
    try{
        await mongoose.connect('mongodb+srv://matiaz490:1234@cluster0.jshz0m1.mongodb.net/medicaApp');
        console.log('MongoDB Connected');
    }catch(err){
        console.log(err);
    }



};


function lol(){
    console.log('lol');
}
export {connectDB, lol}

