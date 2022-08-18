const router = require('express').Router()
const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const verifyApiKey = require('../middlewares/verify-apikey');

require('dotenv').config();

const db = require('../models')
const Participant = db.participants
console.log(process.env.FIREBASE_PROJECT_ID);
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    })

});

router.post('/login', verifyApiKey, (req, res, next) => {
    admin.auth().verifyIdToken(req.body.authtoken)
        .then((decodedToken) => {
            console.log(decodedToken.email);

            Participant.findOne({ where: { pid: decodedToken.uid } }).then(user => {
                if (!user) {
                    return res.status(400).json({ "success": false, "message": "user not found" });
                }
                const token = jwt.sign({ _email: user.email, _name: user.name, _pid: user.pid }, process.env.TOKEN_SECRET);
                return res.json({ "success": true, "jwt": token,"user":user });
            })



        }).catch((err) => {
            console.log(err);
            return res.status(403).send('Unauthorized')
        });

});

router.post('/signup', verifyApiKey, (req, res, next) => {
    admin.auth().verifyIdToken(req.body.authtoken)
        .then((decodedToken) => {
            console.log(decodedToken.email);

            Participant.findOne({ where: { pid: decodedToken.uid } }).then(user => {
                if (user) {
                    return res.status(400).json({ "success": false, "message": "user already exists" });
                }
                const newParticipant = { pid: decodedToken.uid, name: req.body.name, regNo: req.body.regNo, email: req.body.email }
                Participant.create(newParticipant)
                    .then(user => {
                        const token = jwt.sign({ _email: user.email, _name: user.name, _pid: user.pid }, process.env.TOKEN_SECRET);
                        return res.json({ "success": true, "jwt": token,"user":user });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the Participant."
                        });
                    });

            })



        }).catch((err) => {
            console.log(err);
            return res.status(403).send('Unauthorized')
        });

});



module.exports = router