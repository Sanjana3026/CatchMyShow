import mongoose from 'mongoose';

const connectDB = async() =>{
    try{
        console.log("Connecting...");

       mongoose.connection.on('connected' , () => console.log('DataBase Connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/CatchMyShow`)

         console.log("Connected!");
    }
    catch(err){
         console.log(err);
    }
}

export default connectDB;