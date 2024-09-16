const mongoose = require('mongoose');


URI = "mongodb+srv://mouadali:alimouad311@mouad.h3d11.mongodb.net/?retryWrites=true&w=majority&appName=mouad"
const connectDB = async () => {

    try {
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }

}

module.exports = connectDB;
