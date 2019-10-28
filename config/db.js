const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
mongoose.set('useUnifiedTopology', true);

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.erro(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;