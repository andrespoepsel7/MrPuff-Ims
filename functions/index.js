const functions = require("firebase-functions");
const admin = require("firebase-admin")
admin.initializeApp()

/* Forma de (data) para addAdminRole
{
    email:'example@example.com',
    admin: true
}
*/

exports.addAdminRole = functions.https.onCall((data) => {
    // Get User, and add custom claim (admin)
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: data.admin
        })
    }).then(()=>{
        return {
            message: `Exitoso!, ${data.email} se le asignó el rol de ${data.admin}`
        }
    }).catch((err)=> {
        return err.message
    })
})

exports.getAdminRole = functions.https.onCall((data)=>{
    return admin.auth().getUserByEmail(data.email).then((userRecord) => {
        return userRecord.customClaims.admin
    })
})
// Para hacer deploy de las funciones en el servidor:
// firebase deploy --only functions



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
