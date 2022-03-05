var admin = require("firebase-admin");

var serviceAccount = require('../config/firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // Lack of 'databaseURL'
});

module.exports = admin