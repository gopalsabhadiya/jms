const mongoose = require('mongoose');
const config = require('config');
const connectionURI = config.get('mongo.uri');
const dbOptions = config.get('mongo.options');


const connectDB = async () => {
    try {

        await mongoose.connect(connectionURI, dbOptions);
        console.log('MongoDB Conncted');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;