const mongoose = require('mongoose');

// Make sure we are running node 7.6+
// const [major, minor] = process.versions.node.split('.').map(parseFloat);
// if (major < 7 || (major === 7 && minor <= 5)) {
//   console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
//   process.exit();
// }

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database and handle any bad connections
// mongoose.connect(process.env.DATABASE);
mongoose.connect(process.env.MONGO_URI, {user: process.env.DB_USER, pass: process.env.DB_PASS});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// READY?! Let's go!

//Importat todos mis modelos
require('./models/Store');
require('./models/User');

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 3300);
console.log(app.get('port'));

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
