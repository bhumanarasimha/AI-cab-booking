require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartride';

console.log('SmartRide MongoDB Diagnostic Tool');
console.log('=================================');
console.log(`Connecting to database: ${mongoUri}`);

mongoose.connect(mongoUri)
  .then((conn) => {
    console.log('\n✅ Connection Successful!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log('\nDatabase integration check passed.');
    process.exit(0);
  })
  .catch((err) => {
    console.log('\n❌ Connection Failed!');
    console.error(`Error Message: ${err.message}`);
    console.log('\nPossible issues:');
    console.log('1. If running locally, check if MongoDB is installed and started (Run: services.msc in Windows and check the "MongoDB Server" service).');
    console.log('2. If using MongoDB Atlas, check if your current IP address is whitelisted in the Atlas Network Security tab.');
    console.log('3. Verify that your connection string in backend-server/.env is correct.');
    process.exit(1);
  });
