const express = require('express');
const app = express();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore database
const db = admin.firestore();

// Define your API routes and handlers
app.get('/', async (req, res) => {
  try {
    // Query the Firestore database
    const snapshot = await db.collection('contents').get();
    const data = snapshot.docs.map(doc => doc.data());

    res.json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
