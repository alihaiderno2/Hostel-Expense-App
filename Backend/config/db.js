const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']); // Forces Node to use Cloudflare/Google DNS
const { default: mongoose, mongo } = require("mongoose");

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected");
    }
    catch(error){
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;