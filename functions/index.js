const functions = require('firebase-functions');
const express = require('express');
const app = express();
// [END import]

// [START middleware]
const cors = require('cors')({origin: true});
app.use(cors);
// [END middleware]

app.get('/say/hello', (req, res) => {
    // Return success response
    return res.status(200).json({"message":"Hello there... Welcome to mock server."});
  });

const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
app.get('/userProfile/:userId', (req, res) => {
    var docRef = firestore.collection("conversations");
    // firestore.collection("conversations").set({
    //     name: "Los Angeles",
    //     state: "CA",
    //     country: "USA"
    // })
  
    // See https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
    docRef.get().then((x) => {
        x.forEach(z => {
            z.collection("pii").doc("data").get()
            //z.collection("pii").doc("data"); Object.assign(z.data(),z.collection("pii").doc("data"));
            return res.status(200).json(z.collection("pii").doc("data").get());
        })
        return res.status(200).json(x.data());

    }).catch((error) => {
        return res.status(400).json({"message":"Unable to connect to Firestore."});
    });
  });


// Define the Firebase function that will act as Express application
// Note: This `api` must match with `/firebase.json` rewrites rule.
exports.api = functions.https.onRequest(app);