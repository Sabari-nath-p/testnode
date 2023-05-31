const express = require('express');
const app = express();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./key.json');
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




app.get('/documents', async (req, res) => {
  try {
    // Get the optional query parameter
    const documentId = req.query.id;

    // Check if the query parameter is provided
    if (!documentId) {
      // If the parameter is not provided, return an error response
      res.status(400).json({ error: 'Document ID is missing' });
      return;
    }

    // Query the Firestore database for the specified document
    const documentRef = db.collection('contents').doc(documentId);
    const documentSnapshot = await documentRef.get();

    // Check if the document exists
    if (!documentSnapshot.exists) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Retrieve the document data
    const documentData = documentSnapshot.data();

    res.json(documentData);
  } catch (error) {
    console.error('Error retrieving document:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Define your API routes and handlers
app.get('/body', async (req, res) => {
  try {
    // Get the value to match from the query parameter
    const matchValue = req.query.match;
    const matchField = req.query.field;
    // Check if the query parameter is provided
    if (!matchValue) {
      // If the parameter is not provided, return an error response
      res.status(400).json({ error: 'Match value is missing' });
      return;
    }

    // Query the Firestore database for documents that match the specified value
    const querySnapshot = await db.collection('contents').where(matchField, '==', matchValue).get();

    // Check if any documents match the query
    if (querySnapshot.empty) {
      res.status(404).json({ error: 'No documents found' });
      return;
    }

    // Retrieve the matched documents' data
    const documentsData = querySnapshot.docs.map(doc => doc.data());

    res.json(documentsData);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Define your API routes and handlers
app.post('/upload/:collection/:documentId', async (req, res) => {
  try {
    // Get the document ID from the request parameters
    const documentId = req.params.documentId;
    const collection = req.params.collection;

    // Get the data from the request body
    const data = req.body;

    // Add the data to the Firestore collection with the specified document ID
    const documentRef = db.collection(collection).doc(documentId);
    await documentRef.set(JSON.parse(JSON.stringify(data)));

    res.json({ message: 'sucess' });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).send('Internal Server Error');
  }
});




// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
